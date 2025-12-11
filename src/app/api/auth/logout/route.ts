import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

// POST /api/auth/logout - Clear session cookie and revoke tokens
export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (sessionCookie?.value) {
      const auth = getAdminAuth();

      try {
        // Verify the session cookie and get the user's UID
        const decodedClaims = await auth.verifySessionCookie(
          sessionCookie.value,
        );

        // Revoke all refresh tokens for the user
        await auth.revokeRefreshTokens(decodedClaims.uid);
      } catch (error) {
        // If verification fails, just continue to clear the cookie
        console.error("Error revoking tokens:", error);
      }
    }

    // Clear the session cookie
    cookieStore.delete("session");

    return NextResponse.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to logout",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
