import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

// GET /api/auth/session - Verify session and get user data
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      return NextResponse.json(
        {
          success: false,
          error: "No session found",
        },
        { status: 401 },
      );
    }

    const auth = getAdminAuth();

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(
      sessionCookie.value,
      true,
    );

    // Get user data from Firestore by querying the uid field
    const db = getAdminFirestore();
    const snapshot = await db
      .collection("members")
      .where("uid", "==", decodedClaims.uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      );
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    return NextResponse.json({
      success: true,
      user: {
        id: userDoc.id,
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        role: userData?.role || "user",
        ...userData,
      },
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Invalid session",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 401 },
    );
  }
}
