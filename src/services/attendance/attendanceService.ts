import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from '@/config/firebase';

const ATTENDANCE_COLLECTION = 'attendance';

/**
 * Transform Firestore document to AttendanceRecord
 */
export function transformAttendanceDoc(docSnap: any): AttendanceRecord {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    date: data.date,
    serviceType: data.serviceType,
    maleAdults: data.maleAdults || 0,
    femaleAdults: data.femaleAdults || 0,
    children: data.children || 0,
    total: data.total || 0,
    notes: data.notes,
    recordedBy: data.recordedBy,
    recordedByName: data.recordedByName,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
  };
}

/**
 * Create a new attendance record
 */
export async function createAttendanceRecord(
  input: CreateAttendanceInput,
  recordedBy: { id: string; name: string }
): Promise<string> {
  try {
    const db = getFirebaseDb();
    const attendanceRef = collection(db, ATTENDANCE_COLLECTION);

    const total = input.maleAdults + input.femaleAdults + input.children;

    const docRef = await addDoc(attendanceRef, {
      date: input.date,
      serviceType: input.serviceType,
      maleAdults: input.maleAdults,
      femaleAdults: input.femaleAdults,
      children: input.children,
      total,
      notes: input.notes || '',
      recordedBy: recordedBy.id,
      recordedByName: recordedBy.name,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('[AttendanceService] Error creating attendance record:', error);
    throw new Error('Failed to create attendance record');
  }
}

/**
 * Get all attendance records with optional filters
 */
export async function getAttendanceRecords(
  filters?: AttendanceFilters
): Promise<AttendanceRecord[]> {
  try {
    const db = getFirebaseDb();
    const attendanceRef = collection(db, ATTENDANCE_COLLECTION);

    let constraints = [orderBy('date', 'desc')];

    // Note: Firestore range queries work best with indexed fields
    // You may need to create composite indexes for complex queries

    const q = query(attendanceRef, ...constraints);
    const querySnapshot = await getDocs(q);

    let records = querySnapshot.docs.map(transformAttendanceDoc);

    // Apply filters in-memory (for simplicity)
    if (filters?.startDate) {
      records = records.filter(r => r.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      records = records.filter(r => r.date <= filters.endDate!);
    }
    if (filters?.serviceType) {
      records = records.filter(r => r.serviceType === filters.serviceType);
    }

    return records;
  } catch (error) {
    console.error('[AttendanceService] Error fetching attendance records:', error);
    throw new Error('Failed to fetch attendance records');
  }
}

/**
 * Get a single attendance record by ID
 */
export async function getAttendanceRecordById(id: string): Promise<AttendanceRecord | null> {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, ATTENDANCE_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return transformAttendanceDoc(docSnap);
  } catch (error) {
    console.error('[AttendanceService] Error fetching attendance record:', error);
    throw new Error('Failed to fetch attendance record');
  }
}

/**
 * Update an existing attendance record
 */
export async function updateAttendanceRecord(input: UpdateAttendanceInput): Promise<void> {
  try {
    const db = getFirebaseDb();
    const { id, ...updateData } = input;
    const docRef = doc(db, ATTENDANCE_COLLECTION, id);

    const total = updateData.maleAdults + updateData.femaleAdults + updateData.children;

    await updateDoc(docRef, {
      ...updateData,
      total,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('[AttendanceService] Error updating attendance record:', error);
    throw new Error('Failed to update attendance record');
  }
}

/**
 * Delete an attendance record
 */
export async function deleteAttendanceRecord(id: string): Promise<void> {
  try {
    const db = getFirebaseDb();
    const docRef = doc(db, ATTENDANCE_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('[AttendanceService] Error deleting attendance record:', error);
    throw new Error('Failed to delete attendance record');
  }
}

/**
 * Get attendance statistics
 */
export async function getAttendanceStats(filters?: AttendanceFilters): Promise<AttendanceStats> {
  try {
    const records = await getAttendanceRecords(filters);

    if (records.length === 0) {
      return {
        totalServices: 0,
        totalAttendance: 0,
        averageAttendance: 0,
        averageMaleAdults: 0,
        averageFemaleAdults: 0,
        averageChildren: 0,
        highestAttendance: { count: 0, date: '', serviceType: '' },
        lowestAttendance: { count: 0, date: '', serviceType: '' },
        recentTrend: 'stable',
      };
    }

    const totalServices = records.length;
    const totalAttendance = records.reduce((sum, r) => sum + r.total, 0);
    const totalMaleAdults = records.reduce((sum, r) => sum + r.maleAdults, 0);
    const totalFemaleAdults = records.reduce((sum, r) => sum + r.femaleAdults, 0);
    const totalChildren = records.reduce((sum, r) => sum + r.children, 0);

    const averageAttendance = Math.round(totalAttendance / totalServices);
    const averageMaleAdults = Math.round(totalMaleAdults / totalServices);
    const averageFemaleAdults = Math.round(totalFemaleAdults / totalServices);
    const averageChildren = Math.round(totalChildren / totalServices);

    // Find highest and lowest attendance
    const sorted = [...records].sort((a, b) => b.total - a.total);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    // Calculate recent trend (last 4 weeks vs previous 4 weeks)
    const recentTrend = calculateTrend(records);

    return {
      totalServices,
      totalAttendance,
      averageAttendance,
      averageMaleAdults,
      averageFemaleAdults,
      averageChildren,
      highestAttendance: {
        count: highest.total,
        date: highest.date,
        serviceType: highest.serviceType,
      },
      lowestAttendance: {
        count: lowest.total,
        date: lowest.date,
        serviceType: lowest.serviceType,
      },
      recentTrend,
    };
  } catch (error) {
    console.error('[AttendanceService] Error calculating stats:', error);
    throw new Error('Failed to calculate attendance statistics');
  }
}

/**
 * Calculate attendance trend
 */
function calculateTrend(records: AttendanceRecord[]): 'increasing' | 'decreasing' | 'stable' {
  if (records.length < 8) return 'stable';

  // Sort by date ascending
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

  // Get last 8 records
  const recent = sorted.slice(-8);
  const recentFirst4 = recent.slice(0, 4);
  const recentLast4 = recent.slice(-4);

  const avgFirst = recentFirst4.reduce((sum, r) => sum + r.total, 0) / 4;
  const avgLast = recentLast4.reduce((sum, r) => sum + r.total, 0) / 4;

  const percentChange = ((avgLast - avgFirst) / avgFirst) * 100;

  if (percentChange > 5) return 'increasing';
  if (percentChange < -5) return 'decreasing';
  return 'stable';
}

export default {
  createAttendanceRecord,
  getAttendanceRecords,
  getAttendanceRecordById,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  getAttendanceStats,
};
