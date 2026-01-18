/**
 * First Timer types for church visitors
 */

declare global {
  type FirstTimerStatus = "active" | "converted" | "archived";

  /**
   * First Timer visitor information
   */
  interface FirstTimer {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    prayerRequest?: string;

    // Metadata
    visitDate: string; // Date of church visit (ISO string)
    createdAt: string; // When record was created (ISO string)
    displayUntil: string; // When to stop showing (createdAt + 48 hours)

    // Status tracking
    status: FirstTimerStatus; // active | converted | archived
    programmeType?: ProgrammeType; // Which service they attended

    // Conversion tracking
    convertedToMemberId?: string; // If promoted to member
    convertedAt?: string; // When converted (ISO string)
    convertedBy?: string; // Admin who converted them

    // Admin notes
    notes?: string;
    followedUp?: boolean;
    followUpDate?: string;
  }

  /**
   * Minimal first timer info for display
   */
  interface FirstTimerDisplay {
    id: string;
    firstName: string;
    lastName: string;
    visitDate: string;
    programmeType?: ProgrammeType;
  }

  /**
   * First timer statistics
   */
  interface FirstTimerStats {
    total: number;
    active: number; // Currently showing
    converted: number; // Became members
    archived: number; // Past 48 hours, not converted
    thisWeek: number;
    thisMonth: number;
    byProgramme: {
      sunday: number;
      shilo: number;
      vigil: number;
    };
  }

  /**
   * Form data for creating first timer
   */
  interface CreateFirstTimerData {
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    prayerRequest?: string;
    visitDate: string;
    programmeType?: ProgrammeType;
    notes?: string;
  }
}

export {};
