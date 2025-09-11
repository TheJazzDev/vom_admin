declare global {
  type Gender = "male" | "female";
  type AuthType = "email" | "phone";
  type AccountType = "member" | "guest";
  type Role = "user" | "admin" | "super_admin";
  type MaritalStatus =
    | "single"
    | "married"
    | "divorced"
    | "widowed"
    | "separated";

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
    department: Department[];
    band: Band[];
    ministry: Ministry[];
    hasPassword?: boolean;
    authType: AuthType;
    primaryPhone: string;
    secondaryPhone?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    accountType: AccountType;
  }
}

export {};
