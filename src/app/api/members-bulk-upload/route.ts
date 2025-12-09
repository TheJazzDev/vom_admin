import { promises as fs } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { NextResponse } from "next/server";
import { syncMembersToFirebase } from "@/services/members";
import { parseSheetRowToMember } from "@/services/members/bulkService";

// https://docs.google.com/spreadsheets/d/1KrDOAPA7GV-G1HWyNv-aGODIGjzVIMTwTlKVS4wgKNs/gviz/tq?tqx=out:csv    members
// https://docs.google.com/spreadsheets/d/1wkpexdF9hBGl1ko3FST8tYeMrp6o6t-H5JPKAC0mQKE/gviz/tq?tqx=out:csv    test

export const maxDuration = 60;

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), "src/app/api/data", "data.csv");

    // Read the CSV file from the file system
    const csvContent = await fs.readFile(csvPath, "utf-8");

    // Parse the CSV content
    const parser = parse(csvContent, {
      delimiter: ",",
      from_line: 2,
    });

    const values = [];
    for await (const row of parser) {
      values.push(row);
    }

    if (values.length === 0) {
      return NextResponse.json({
        error: "No data found in CSV",
        totalRows: 0,
      });
    }

    const parsedMembers = values.map((row: any, _index: number) =>
      parseSheetRowToMember(row),
    );

    const syncResults = await syncMembersToFirebase(parsedMembers);

    return NextResponse.json({
      success: true,
      totalProcessed: parsedMembers.length,
      memberSync: syncResults,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Failed to process CSV data",
        details: error.message,
        code: error.code,
      },
      { status: 500 },
    );
  }
}
