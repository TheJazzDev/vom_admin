import { NextResponse } from "next/server";
import { updateBandStatistics } from "@/services/bands/bandSync";

export async function GET() {
  try {
    const results = await updateBandStatistics();

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
