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

export function getPrayersRef(): CollectionReference {
  return collection(getFirebaseDb(), "dailyPrayers");
}

export function getFirstTimersRef(): CollectionReference {
  return collection(getFirebaseDb(), "firstTimers");
}

export function getBibleStudyRef(): CollectionReference {
  return collection(getFirebaseDb(), "bibleStudy");
}

export function getBibleStudyTopicsRef(): CollectionReference {
  return collection(getFirebaseDb(), "bibleStudyTopics");
}

export function getSermonsRef(): CollectionReference {
  return collection(getFirebaseDb(), "sermons");
}

export function getSermonSeriesRef(): CollectionReference {
  return collection(getFirebaseDb(), "sermonSeries");
}

export function getTestimoniesRef(): CollectionReference {
  return collection(getFirebaseDb(), "testimonies");
}
