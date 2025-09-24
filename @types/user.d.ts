declare global {
  type Gender = "male" | "female";
  type AuthType = "" | "email" | "phone";
  type AccountType = "member" | "guest";
  type Role = "user" | "admin" | "super_admin";
  type MaritalStatus =
    | "single"
    | "married"
    | "divorced"
    | "widowed"
    | "separated";

  type Ministry = "Children Ministry" | "Youth Fellowship";

  interface UserProfile {
    id: string;
    uid: string;
    avatar: string;
    firstName: string;
    middleName: string;
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
    occupation: string;
    maritalStatus: MaritalStatus;
    departmentKeys: DepartmentKeys[];
    department: DepartmentData[];
    band: BandData[];
    bandKeys: BandKeys[];
    ministry: Ministry[];
    primaryPhone: string;
    secondaryPhone?: string;
    authType: AuthType;
    hasPassword?: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    accountType: AccountType;
    lastLoginAt: string;
  }
}

export {};
