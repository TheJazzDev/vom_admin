import { type CollectionReference, collection } from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

// Lazy getters for collection references
// These only access db when called, allowing build to succeed without config

export function getBandsRef(): CollectionReference {
  return collection(getFirebaseDb(), "bands");
}

export function getGuestRef(): CollectionReference {
  return collection(getFirebaseDb(), "guests");
}

export function getMembersRef(): CollectionReference {
  return collection(getFirebaseDb(), "members");
}

export function getChildrenRef(): CollectionReference {
  return collection(getFirebaseDb(), "children");
}

export function getProgrammesRef(): CollectionReference {
  return collection(getFirebaseDb(), "programmes");
}

export function getNotificationRef(): CollectionReference {
  return collection(getFirebaseDb(), "notifications");
}

export function getAnnouncementsRef(): CollectionReference {
  return collection(getFirebaseDb(), "announcements");
}
