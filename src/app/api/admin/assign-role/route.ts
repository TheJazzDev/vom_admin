import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { canModifyRole, RoleEnum } from "@/enums";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/assign-role
 * Assign a role to a user (super_admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify session and get current user
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const auth = getAdminAuth();
    const decodedToken = await auth.verifySessionCookie(session.value);

    const db = getAdminFirestore();

    // Get current user's role
    const currentUserSnapshot = await db
      .collection("members")
      .where("uid", "==", decodedToken.uid)
      .limit(1)
      .get();

    if (currentUserSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Current user not found" },
        { status: 404 },
      );
    }

    const currentUserData = currentUserSnapshot.docs[0].data();
    const currentUserRole = currentUserData.role || "user";

    // Only super_admin can assign roles
    if (currentUserRole !== RoleEnum.SUPER_ADMIN) {
      return NextResponse.json(
        {
          success: false,
          error: "Only super admins can assign roles",
        },
        { status: 403 },
      );
    }

    // Get request body
    const { userId, role, reason } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID and role are required",
        },
        { status: 400 },
      );
    }

    // Validate role
    const validRoles = Object.values(RoleEnum);
    if (!validRoles.includes(role as RoleEnum)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Get target user
    const targetUserDoc = await db.collection("members").doc(userId).get();

    if (!targetUserDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: `User with ID ${userId} not found`,
        },
        { status: 404 },
      );
    }

    const targetUserData = targetUserDoc.data();
    const targetUserCurrentRole = targetUserData?.role || "user";

    // Check if modifier can change this role
    if (!canModifyRole(currentUserRole, targetUserCurrentRole)) {
      return NextResponse.json(
        {
          success: false,
          error: "You do not have permission to modify this user's role",
        },
        { status: 403 },
      );
    }

    // Prevent self-modification
    if (decodedToken.uid === targetUserData?.uid) {
      return NextResponse.json(
        {
          success: false,
          error: "You cannot change your own role",
        },
        { status: 400 },
      );
    }

    // Update user role
    await db.collection("members").doc(userId).update({
      role: role,
      updatedAt: new Date().toISOString(),
    });

    // Create audit log
    await db.collection("auditLogs").add({
      type: "role_assignment",
      action: "assign_role",
      performedBy: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: `${currentUserData.firstName} ${currentUserData.lastName}`,
        role: currentUserRole,
      },
      target: {
        userId: userId,
        email: targetUserData?.email,
        name: `${targetUserData?.firstName || ""} ${targetUserData?.lastName || ""}`,
        previousRole: targetUserCurrentRole,
        newRole: role,
      },
      reason: reason || null,
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // Get updated user data
    const updatedUserDoc = await db.collection("members").doc(userId).get();
    const updatedUserData = updatedUserDoc.data();

    return NextResponse.json({
      success: true,
      message: `Role updated successfully`,
      user: {
        id: userId,
        uid: updatedUserData?.uid,
        email: updatedUserData?.email,
        firstName: updatedUserData?.firstName,
        lastName: updatedUserData?.lastName,
        role: updatedUserData?.role,
        previousRole: targetUserCurrentRole,
      },
    });
  } catch (error) {
    console.error("Error assigning role:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to assign role",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
