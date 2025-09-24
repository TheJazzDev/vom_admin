import { promises as fs } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { NextResponse } from "next/server";
import { syncChildrenToFirebase } from "@/services/children";
import { parseChildRowToProfile } from "@/services/children/perseFields";

// https://docs.google.com/spreadsheets/d/1GxXjnKrbqjrsGyePzx6AwvCuuED9R7_TGbL6CLZMRiQ/gviz/tq?tqx=out:csv   children

export async function GET() {
  try {
    const csvPath = path.join(
      process.cwd(),
      "src/app/api/data",
      "children.csv",
    );
    const csvContent = await fs.readFile(csvPath, "utf-8");

    const parser = parse(csvContent, {
      delimiter: ",",
      from_line: 3, // Skip headers
    });

    const values = [];
    for await (const row of parser) {
      values.push(row);
    }

    console.log(`Total children rows parsed: ${values.length}`);

    // Parse children with parent linking (this is now async)
    const parsedChildren = [];
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const actualRowNumber = i + 3;
      const firstName = row[2];
      const lastName = row[4];
      console.log(
        `Processing child row ${actualRowNumber}: ${firstName} ${lastName}`,
      );

      const child = await parseChildRowToProfile(row, actualRowNumber);
      parsedChildren.push(child);
    }

    console.log(`Successfully parsed ${parsedChildren.length} children`);

    const syncResults = await syncChildrenToFirebase(parsedChildren);

    return NextResponse.json({
      success: true,
      totalRowsParsed: values.length,
      totalProcessed: parsedChildren.length,
      childrenSync: syncResults,
    });
  } catch (error: any) {
    console.error("Children CSV processing error:", error);
    return NextResponse.json(
      {
        error: "Failed to process children CSV data",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
