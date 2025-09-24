import { DepartmentKeysEnum } from "@/enums";
import { mapBandName, mapDepartmentName } from "./utils";

function extractBandRole(positionPart: string): BandRole {
  const lower = positionPart.toLowerCase().trim();

  // More precise role matching - check for exact phrases
  if (lower.includes("vice captain")) return "Vice Captain";
  if (lower.includes("captain")) return "Captain";
  if (lower.includes("assistant choir master")) return "Assistant Choir Master";
  if (lower.includes("choir master")) return "Choir Master";
  if (lower.includes("treasurer")) return "Treasurer";
  if (lower.includes("secretary")) return "Secretary";

  return "Member";
}

function extractBandName(positionPart: string): string {
  // Try multiple patterns
  const patterns = [
    /(?:captain|vice captain|secretary|choir master|assistant choir master)\s+([a-zA-Z\s]+)\s+band/i,
    /([a-zA-Z\s]+)\s+band\s+(?:captain|vice captain|secretary|choir master|assistant choir master)/i,
    /([a-zA-Z\s]+)\s+band/i,
  ];

  for (const pattern of patterns) {
    const match = positionPart.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  // If no "band" keyword, try to match against known band names
  const knownBands = [
    "choir",
    "love divine",
    "daniel",
    "deborah",
    "esther",
    "queen esther",
    "good women",
    "warden",
    "john beloved",
    "faith",
    "mary",
    "holy mary",
  ];
  const lower = positionPart.toLowerCase();

  for (const band of knownBands) {
    if (lower.includes(band)) {
      return band;
    }
  }

  return "";
}

function extractDepartmentRole(positionPart: string): DepartmentRole {
  const lower = positionPart.toLowerCase();
  if (lower.includes("unit head") || lower.includes("head")) return "Head";
  if (lower.includes("assistant")) return "Assistant";
  if (lower.includes("secretary")) return "Secretary";
  return "Member";
}

function extractDepartmentName(positionPart: string): DepartmentKeys | null {
  const lower = positionPart.toLowerCase();
  if (lower.includes("programme")) return DepartmentKeysEnum.PROGRAMME;
  if (lower.includes("media")) return DepartmentKeysEnum.MEDIA;
  if (lower.includes("treasury")) return DepartmentKeysEnum.TREASURY;
  if (lower.includes("technical")) return DepartmentKeysEnum.TECHNICAL;
  if (lower.includes("drama")) return DepartmentKeysEnum.DRAMA;
  if (lower.includes("it")) return DepartmentKeysEnum.IT;
  if (lower.includes("evangelism")) return DepartmentKeysEnum.EVANGELISM;
  if (lower.includes("sanitation")) return DepartmentKeysEnum.SANITATION;
  if (lower.includes("secretariat")) return DepartmentKeysEnum.SECRETARIAT;
  if (lower.includes("interpretation"))
    return DepartmentKeysEnum.INTERPRETATION;
  return null;
}

// Enhanced position parsing function
export function parsePosition(positionStr: string): {
  bands: BandData[];
  departments: DepartmentData[];
  positions: string[];
  ministries: Ministry[];
} {
  const bands: BandData[] = [];
  const departments: DepartmentData[] = [];
  const positions: string[] = [];
  const ministries: Ministry[] = [];

  if (!positionStr) return { bands, departments, positions, ministries };

  const parts = positionStr.split(",").map((p) => p.trim());

  for (const part of parts) {
    const lowerPart = part.toLowerCase();

    // Check for band roles with improved logic
    if (
      lowerPart.includes("band") ||
      lowerPart.includes("deborah") ||
      lowerPart.includes("daniel") ||
      lowerPart.includes("esther") ||
      lowerPart.includes("choir") ||
      lowerPart.includes("warden") ||
      lowerPart.includes("faith") ||
      lowerPart.includes("holy") ||
      lowerPart.includes("mary") ||
      lowerPart.includes("john") ||
      lowerPart.includes("beloved")
    ) {
      const bandRole = extractBandRole(part);
      const bandName = extractBandName(part);
      const bandKey = mapBandName(bandName);

      if (bandKey) {
        // Check if this band already exists in the array
        const existingBandIndex = bands.findIndex((b) => b.name === bandKey);

        if (existingBandIndex >= 0) {
          // Role priority
          const rolePriority = {
            "Choir Master": 1,
            Captain: 2,
            "Assistant Choir Master": 3,
            "Vice Captain": 4,
            Treasurer: 5,
            Secretary: 6,
            Member: 7,
          };

          // Update existing band with higher priority role
          const currentRole = bands[existingBandIndex].role;
          const newRole = bandRole;

          if (rolePriority[newRole] < rolePriority[currentRole]) {
            bands[existingBandIndex].role = newRole;
          }
        } else {
          bands.push({ name: bandKey, role: bandRole });
        }
        // ✅ ALWAYS add original position text
        positions.push(part);
        continue;
      }
    } else if (
      lowerPart.includes("unit head") ||
      lowerPart.includes("department") ||
      lowerPart.includes("programme") ||
      lowerPart.includes("media") ||
      lowerPart.includes("treasury") ||
      lowerPart.includes("technical") ||
      lowerPart.includes("drama") ||
      lowerPart.includes("interpretation") ||
      lowerPart.includes("sanitation") ||
      lowerPart.includes("evangelism") ||
      lowerPart.includes("it")
    ) {
      const deptRole = extractDepartmentRole(part);
      const deptName = extractDepartmentName(part);
      const deptKey = mapDepartmentName(deptName);

      if (deptKey) {
        // Check if this department already exists
        const existingDeptIndex = departments.findIndex(
          (d) => d.name === deptKey,
        );

        if (existingDeptIndex >= 0) {
          // Update with higher priority role
          const rolePriority = {
            Head: 1,
            Assistant: 2,
            Secretary: 3,
            Member: 4,
          };

          const currentRole = departments[existingDeptIndex].role;
          if (rolePriority[deptRole] < rolePriority[currentRole]) {
            departments[existingDeptIndex].role = deptRole;
          }
        } else {
          departments.push({ name: deptKey, role: deptRole });
        }
        // ✅ ALWAYS add original position text
        positions.push(part);
        continue;
      }
    } else if (lowerPart.includes("youth") && lowerPart.includes("president")) {
      ministries.push("Youth Fellowship");
      positions.push(part);
      continue;
    } else if (
      lowerPart.includes("children") &&
      lowerPart.includes("ministry")
    ) {
      ministries.push("Children Ministry");
      positions.push(part);
      continue;
    }

    // ✅ ALWAYS add original position text
    positions.push(part);
  }

  return { bands, departments, positions, ministries };
}
