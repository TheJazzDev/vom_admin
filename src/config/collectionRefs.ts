import { collection } from "firebase/firestore";
import { db } from "./firebase";

export const guestRef = collection(db, "guests");
export const membersRef = collection(db, "members");
export const childrenRef = collection(db, "children");
