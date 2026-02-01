import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirebaseDb } from '@/config/firebase';

const MEMBERS_COLLECTION = 'members';

/**
 * Calculate days until next birthday
 */
function daysUntilBirthday(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  // Set this year's birthday
  const thisYearBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  // If birthday has passed this year, use next year
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }

  // Calculate days difference
  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Check if a date matches today's month and day
 */
function isBirthdayToday(dateOfBirth: string): boolean {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  return (
    birthDate.getMonth() === today.getMonth() &&
    birthDate.getDate() === today.getDate()
  );
}

/**
 * Transform member document to BirthdayMember
 */
function transformToBirthdayMember(doc: any): BirthdayMember | null {
  const data = doc.data();

  // Skip if no date of birth
  if (!data.dateOfBirth) {
    return null;
  }

  return {
    id: doc.id,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    dateOfBirth: data.dateOfBirth,
    photoURL: data.photoURL,
    expoPushToken: data.expoPushToken,
    daysUntilBirthday: daysUntilBirthday(data.dateOfBirth),
  };
}

/**
 * Get members with birthdays today
 */
export async function getTodaysBirthdays(): Promise<BirthdayMember[]> {
  try {
    const db = getFirebaseDb();
    const membersRef = collection(db, MEMBERS_COLLECTION);

    // Fetch all members (we'll filter in memory since Firestore can't query by month/day)
    const querySnapshot = await getDocs(membersRef);

    const birthdays: BirthdayMember[] = [];

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();

      if (data.dateOfBirth && isBirthdayToday(data.dateOfBirth)) {
        const member = transformToBirthdayMember(doc);
        if (member) {
          birthdays.push(member);
        }
      }
    });

    return birthdays;
  } catch (error) {
    console.error('[BirthdayService] Error fetching today\'s birthdays:', error);
    throw new Error('Failed to fetch today\'s birthdays');
  }
}

/**
 * Get members with upcoming birthdays (next N days)
 */
export async function getUpcomingBirthdays(days: number = 7): Promise<BirthdayMember[]> {
  try {
    const db = getFirebaseDb();
    const membersRef = collection(db, MEMBERS_COLLECTION);

    // Fetch all members
    const querySnapshot = await getDocs(membersRef);

    const birthdays: BirthdayMember[] = [];

    querySnapshot.docs.forEach((doc) => {
      const member = transformToBirthdayMember(doc);

      if (member && member.daysUntilBirthday > 0 && member.daysUntilBirthday <= days) {
        birthdays.push(member);
      }
    });

    // Sort by days until birthday
    birthdays.sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);

    return birthdays;
  } catch (error) {
    console.error('[BirthdayService] Error fetching upcoming birthdays:', error);
    throw new Error('Failed to fetch upcoming birthdays');
  }
}

/**
 * Get members with birthdays this month
 */
export async function getThisMonthsBirthdays(): Promise<BirthdayMember[]> {
  try {
    const db = getFirebaseDb();
    const membersRef = collection(db, MEMBERS_COLLECTION);

    const today = new Date();
    const currentMonth = today.getMonth();

    // Fetch all members
    const querySnapshot = await getDocs(membersRef);

    const birthdays: BirthdayMember[] = [];

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();

      if (data.dateOfBirth) {
        const birthDate = new Date(data.dateOfBirth);

        if (birthDate.getMonth() === currentMonth) {
          const member = transformToBirthdayMember(doc);
          if (member) {
            birthdays.push(member);
          }
        }
      }
    });

    // Sort by day of month
    birthdays.sort((a, b) => {
      const dateA = new Date(a.dateOfBirth).getDate();
      const dateB = new Date(b.dateOfBirth).getDate();
      return dateA - dateB;
    });

    return birthdays;
  } catch (error) {
    console.error('[BirthdayService] Error fetching this month\'s birthdays:', error);
    throw new Error('Failed to fetch this month\'s birthdays');
  }
}

/**
 * Get birthday summary (today, upcoming, this month)
 */
export async function getBirthdaySummary(): Promise<BirthdaySummary> {
  try {
    const [today, upcoming, thisMonth] = await Promise.all([
      getTodaysBirthdays(),
      getUpcomingBirthdays(7),
      getThisMonthsBirthdays(),
    ]);

    return {
      today,
      upcoming,
      thisMonth,
    };
  } catch (error) {
    console.error('[BirthdayService] Error fetching birthday summary:', error);
    throw new Error('Failed to fetch birthday summary');
  }
}

export default {
  getTodaysBirthdays,
  getUpcomingBirthdays,
  getThisMonthsBirthdays,
  getBirthdaySummary,
};
