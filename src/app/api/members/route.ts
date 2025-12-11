import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

// GET /api/members - Fetch all members
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const band = searchParams.get("band");
    const department = searchParams.get("department");

    const db = getAdminFirestore();
    let query = db.collection("members");

    // Apply filters if provided
    if (status) {
      query = query.where("status", "==", status) as any;
    }
    if (band) {
      query = query.where("bandKeys", "array-contains", band) as any;
    }
    if (department) {
      query = query.where(
        "departmentKeys",
        "array-contains",
        department,
      ) as any;
    }

    const snapshot = await query.get();
    const members: UserProfile[] = [];

    snapshot.forEach((doc) => {
      members.push({
        id: doc.id,
        ...doc.data(),
      } as UserProfile);
    });

    return NextResponse.json({
      success: true,
      data: members,
      count: members.length,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch members",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// POST /api/members - Create new member
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getAdminFirestore();

    // Create member document
    const memberRef = db.collection("members").doc();
    const memberData = {
      ...body,
      id: memberRef.id,
      createdAt: new Date().toISOString(),
      status: body.status || "active",
      verified: body.verified || false,
      emailVerified: body.emailVerified || false,
      phoneVerified: body.phoneVerified || false,
      role: body.role || "user",
    };

    await memberRef.set(memberData);

    return NextResponse.json({
      success: true,
      data: memberData,
      message: "Member created successfully",
    });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create member",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
