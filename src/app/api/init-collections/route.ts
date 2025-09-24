import { NextResponse } from "next/server";
import { BANDS_CONFIG } from "@/constants/directory/BANDS_CONFIG";
import { DEPARTMENTS_CONFIG } from "@/constants/directory/DEPARTMENTS_CONFIG";
import { initializeCollections } from "@/services/collectionsSetup";

export async function GET() {
  try {
    console.log("Starting collections initialization...");

    const result = await initializeCollections();

    return NextResponse.json({
      success: true,
      message: "Collections initialized successfully",
      data: {
        ...result,
        bandsInitialized: Object.keys(BANDS_CONFIG),
        departmentsInitialized: Object.keys(DEPARTMENTS_CONFIG),
      },
    });
  } catch (error: any) {
    console.error("Failed to initialize collections:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize collections",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
