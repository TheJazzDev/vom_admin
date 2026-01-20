import { cookies } from "next/headers";
import { getAdminAuth, getAdminFirestore } from "./firebase-admin";

export interface SessionUser {
  id: string;
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

/**
 * Get current authenticated user from session
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      return null;
    }

    const auth = getAdminAuth();
    const decodedClaims = await auth.verifySessionCookie(
      sessionCookie.value,
      true,
    );

    // Get user data from Firestore
    const db = getAdminFirestore();
    const snapshot = await db
      .collection("members")
      .where("uid", "==", decodedClaims.uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    return {
      id: userDoc.id,
      uid: decodedClaims.uid,
      email: decodedClaims.email || "",
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      role: userData?.role || "user",
    };
  } catch (error) {
    console.error("[Session] Error getting current user:", error);
    return null;
  }
}

/**
 * Get user's display name
 */
export function getUserDisplayName(user: SessionUser): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  if (user.email) {
    return user.email.split("@")[0];
  }
  return "Admin";
}
