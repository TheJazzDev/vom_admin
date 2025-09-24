import { NextResponse } from "next/server";
import { updateDepartmentStatistics } from "@/services/departments/departmentSync";

export async function GET() {
  try {
    const results = await updateDepartmentStatistics();

    return NextResponse.json({
      ...results,
      success: results.success,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update band statistics", details: error.message },
      { status: 500 },
    );
  }
}
