import { BandKeys } from "@/enums";
import { BandDisplayNames } from "@/enums/bands";

// Convert from DB to Form
export const dbToForm = (dbBands: BandData[]): BandData[] =>
  dbBands.map((band) => ({
    name: band.name,
    role: band.role,
  }));

// Convert from Form to DB
export const formToDb = (formBands: BandData[]): BandData[] =>
  formBands.map((band) => ({
    name: band.name,
    role: band.role,
  }));

// Convert from DB to Display
export const dbToDisplay = (dbBands: BandData[]): DisplayBand[] =>
  dbBands.map((band) => ({
    key: band.name,
    displayName: BandDisplayNames[band.name as BandKeys],
    role: band.role,
    roleDisplay: getRoleDisplay(band.role, band.name),
  }));

// Convert from Form to Display
export const formToDisplay = (formBands: BandData[]): DisplayBand[] =>
  formBands.map((band) => ({
    key: band.name,
    displayName: BandDisplayNames[band.name as BandKeys],
    role: band.role,
    roleDisplay: getRoleDisplay(band.role, band.name),
  }));

// Get proper role display name based on band
const getRoleDisplay = (role: BandRole, bandName: BandKeys): string => {
  if (bandName === BandKeys.CHOIR) {
    switch (role) {
      case "Captain":
        return "Choir Master";
      case "Vice Captain":
        return "Assistant Choir Master";
      default:
        return role;
    }
  }
  return role;
};

// Get all available roles for a specific band
export const getAvailableRoles = (bandName: BandKeys): BandRole[] => {
  if (bandName === BandKeys.CHOIR) {
    return ["Choir Master", "Assistant Choir Master", "Secretary", "Member"];
  }
  return ["Captain", "Vice Captain", "Secretary", "Member"];
};

// Convert display role back to database role
export const displayRoleToDbRole = (
  displayRole: string,
  bandName: BandKeys,
): BandRole => {
  if (bandName === BandKeys.CHOIR) {
    switch (displayRole) {
      case "Choir Master":
        return "Captain";
      case "Assistant Choir Master":
        return "Vice Captain";
      default:
        return displayRole as BandRole;
    }
  }
  return displayRole as BandRole;
};
