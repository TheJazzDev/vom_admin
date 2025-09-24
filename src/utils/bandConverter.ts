import { BandKeysEnum } from "@/enums";

// import { BandDisplayNames } from "@/enums/bands";

// Convert from DB to Display
// export const dbToDisplay = (dbBands: BandData[]): DisplayBand[] =>
//   dbBands.map((band) => ({
//     key: band.name,
//     displayName: BandDisplayNames[band.name as Enum],
//     role: band.role,
//     roleDisplay: getRoleDisplay(band.role, band.name),
//   }));

// Get proper role display name based on band
const _getRoleDisplay = (role: BandRole, bandName: BandKeys): string => {
  if (bandName === BandKeysEnum.CHOIR) {
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
  if (bandName === BandKeysEnum.CHOIR) {
    return ["Choir Master", "Assistant Choir Master", "Secretary", "Member"];
  }
  return ["Captain", "Vice Captain", "Secretary", "Member"];
};

// Convert display role back to database role
export const displayRoleToDbRole = (
  displayRole: string,
  bandName: BandKeys,
): BandRole => {
  if (bandName === BandKeysEnum.CHOIR) {
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
