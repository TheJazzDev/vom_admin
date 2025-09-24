declare global {
  export interface ChildrenProfile {
    id: string;
    avatar: string;
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: Gender;
    dob: string;
    fatherParentId?: string;
    motherParentId?: string;
    parentPhones: string[];
    createdAt: string;
    updatedAt: string;
  }
}

export {};
