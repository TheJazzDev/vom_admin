declare global {
  type Gender = "male" | "female";
  type AuthType = "email" | "phone";
  type Role = "member" | "guest" | "admin" | "super_admin";

  type Department =
    | "Interpretation"
    | "Programme"
    | "Media"
    | "Treasury"
    | "Technical"
    | "Drama"
    | "IT"
    | "Envagicialism"
    | "Sanitation";

  type Band =
    | "Choir"
    | "Love Divine"
    | "Daniel"
    | "Deborah"
    | "Queen Esther"
    | "Good Women"
    | "Warden"
    | "John Beloved"
    | "Faith"
    | "Holy Mary";

  type Ministry = "Children Ministry" | "Youth Fellowship";

  interface CommonDetails {
    uid: string;
    avatar: string;
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    position: string[];
    address: string;
    joinDate: string;
    createdAt: string;
    status: "active" | "inactive";
    verified: boolean;
    gender: Gender;
    dob: string;
    department: Department[];
    band: Band[];
    ministry: Ministry[];
    memberSince: string;
    hasPassword?: boolean;
    authType: AuthType;
    primaryPhone: string;
    secondaryPhone?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  }

  interface MemberProfile extends CommonDetails {
    accountType: "member";
    memberId: string;
  }

  interface GuestProfile extends CommonDetails {
    accountType: "guest";
    guestId: string;
  }

  type UserProfile = MemberProfile | GuestProfile;
}

export {};
