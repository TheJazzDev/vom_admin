import type { DocumentData, QuerySnapshot } from "firebase-admin/firestore";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_ROLES } from "@/enums";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users
 * Get list of users for role management
 * Supports search by name or email via ?search=query parameter
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add session verification and check if user is super_admin

    const db = getAdminFirestore();
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("search")?.toLowerCase().trim();

    let membersSnapshot: QuerySnapshot<DocumentData>;

    if (searchQuery) {
      // If searching, get all members and filter in memory
      membersSnapshot = await db.collection("members").get();
    } else {
      // If not searching, only get users with admin roles
      membersSnapshot = await db
        .collection("members")
        .where("role", "in", ADMIN_ROLES)
        .get();
    }

    let users = membersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid || null,
        email: data.email || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        role: data.role || "user",
        position: data.position || [],
        bandRoles: data.bandRoles || [],
        departmentRoles: data.departmentRoles || [],
        profilePicture: data.profilePicture || null,
        verified: data.verified || false,
        status: data.status || "active",
        lastLoginAt: data.lastLoginAt || null,
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
      };
    });

    // Filter by search query if provided
    if (searchQuery) {
      users = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        return fullName.includes(searchQuery) || email.includes(searchQuery);
      });
    }

    // Sort by firstName
    users.sort((a, b) => {
      const nameA = a.firstName.toLowerCase();
      const nameB = b.firstName.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
