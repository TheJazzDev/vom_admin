declare global {
  type ServiceType = 'Sunday Service' | 'Midweek Service' | 'Special Event';

  interface AttendanceRecord {
    id: string;
    date: string; // ISO date string
    serviceType: ServiceType;
    maleAdults: number;
    femaleAdults: number;
    children: number;
    total: number;
    notes?: string;
    recordedBy: string; // User ID
    recordedByName: string;
    createdAt: string; // ISO timestamp
    updatedAt?: string;
  }

  interface CreateAttendanceInput {
    date: string;
    serviceType: ServiceType;
    maleAdults: number;
    femaleAdults: number;
    children: number;
    notes?: string;
  }

  interface UpdateAttendanceInput extends CreateAttendanceInput {
    id: string;
  }

  interface AttendanceStats {
    totalServices: number;
    totalAttendance: number;
    averageAttendance: number;
    averageMaleAdults: number;
    averageFemaleAdults: number;
    averageChildren: number;
    highestAttendance: {
      count: number;
      date: string;
      serviceType: string;
    };
    lowestAttendance: {
      count: number;
      date: string;
      serviceType: string;
    };
    recentTrend: 'increasing' | 'decreasing' | 'stable';
  }

  interface AttendanceFilters {
    startDate?: string;
    endDate?: string;
    serviceType?: ServiceType;
  }
}

export {};
