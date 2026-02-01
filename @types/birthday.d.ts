declare global {
  interface BirthdayMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string; // ISO date string
    photoURL?: string;
    expoPushToken?: string;
    daysUntilBirthday: number; // 0 = today, 1 = tomorrow, etc.
  }

  interface BirthdaySummary {
    today: BirthdayMember[];
    upcoming: BirthdayMember[]; // Next 7 days
    thisMonth: BirthdayMember[];
  }

  interface SendBirthdayWishInput {
    memberId: string;
    customMessage?: string;
  }
}

export {};
