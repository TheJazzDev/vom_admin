import { collection } from "firebase/firestore";
import { db } from "./firebase";

export const bandsRef = collection(db, "bands");
export const guestRef = collection(db, "guests");
export const membersRef = collection(db, "members");
export const childrenRef = collection(db, "children");
export const programmesRef = collection(db, "programmes");
export const notificationRef = collection(db, "notifications");
export const announcementsRef = collection(db, "announcements");
