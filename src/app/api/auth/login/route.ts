import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

// POST /api/auth/login - Create session cookie
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        {
          success: false,
          error: "ID token is required",
        },
        { status: 400 },
      );
    }

    const auth = getAdminAuth();

    // Verify the ID token first
    const decodedToken = await auth.verifyIdToken(idToken);

    // Check if user has admin role
    const db = getAdminFirestore();
    const snapshot = await db
      .collection("members")
      .where("uid", "==", decodedToken.uid)
      .limit(1)
      .get();

    // User NOT found
    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // User found
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Check role
    const userRole = userData.role || "user";

    if (userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Access denied. Admin privileges required." },
        { status: 403 },
      );
    }

    // Update last login
    await db.collection("members").doc(userDoc.id).update({
      lastLoginAt: new Date().toISOString(),
    });

    // Create session cookie (expires in 10 days)
    const expiresIn = 60 * 60 * 24 * 10 * 1000; // 10 days in milliseconds
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: userDoc.id,
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: userRole,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to login",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 401 },
    );
  }
}
