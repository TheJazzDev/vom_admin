declare global {
  type BandKeys =
    | "CHOIR"
    | LOVE_DIVINE
    | DANIEL
    | DEBORAH
    | QUEEN_ESTHER
    | GOOD_WOMEN
    | WARDEN
    | JOHN_BELOVED
    | FAITH
    | HOLY_MARY
    | UNASSIGNED;

  // 🎵 Roles across all bands
  type BandRole =
    | "Captain"
    | "Vice Captain"
    | "Choir Master"
    | "Assistant Choir Master"
    | "Treasurer"
    | "Secretary"
    | "Member";

  interface BandData {
    name: BandKeys;
    role: BandRole;
  }

  // 🎸 Leadership types (choir vs. other bands)
  type ChoirLeadership = {
    choirMaster: string | null;
    assistantChoirMaster: string | null;
    secretary: string | null;
  };

  type DefaultBandLeadership = {
    captain: string | null;
    vice: string | null;
    secretary: string | null;
  };

  // Union type: leadership depends on band
  type BandLeadership = ChoirLeadership | DefaultBandLeadership;

  // ⚙️ Band config structure
  interface BandConfigEntry {
    id: BandKeys;
    name: string;
    icon: IconType;
    description: string;
    gradient: GradientColor;
  }

  type BandConfigRecord = Record<BandKeys, BandConfigEntry>;

  export interface Band {
    id: BandKeys;
    name: string;
    displayName: string;
    description: string;
    icon1: tIconSymbolName;
    icon2: string;
    gradient: GradientColor;
    createdAt: string;
    isActive: boolean;
    memberCount: number;
    leadership: BandLeadership;
    meetingDay?: string | null;
    meetingTime?: string | null;
  }

  type BandWithMembers = Band & { members: UserProfile[] };
}

export {};
