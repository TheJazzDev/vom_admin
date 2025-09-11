import type { IconType } from "react-icons/lib";

export enum BandRoleEnum {
  CAPTAIN = "Captain",
  VICE_CAPTAIN = "Vice Captain",
  SECRETARY = "Secretary",
  MEMBER = "Member",
  CHOIR_MASTER = "Choir Master",
  ASSISTANT_CHOIR_MASTER = "Assistant Choir Master",
}

export enum BandKeys {
  CHOIR = "CHOIR",
  LOVE_DIVINE = "LOVE_DIVINE",
  DANIEL = "DANIEL",
  DEBORAH = "DEBORAH",
  QUEEN_ESTHER = "QUEEN_ESTHER",
  GOOD_WOMEN = "GOOD_WOMEN",
  WARDEN = "WARDEN",
  JOHN_BELOVED = "JOHN_BELOVED",
  FAITH = "FAITH",
  HOLY_MARY = "HOLY_MARY",
  UNASSIGNED = "UNASSIGNED",
}

export const BandDisplayNames: Record<BandKeys, string> = {
  [BandKeys.CHOIR]: "Choir",
  [BandKeys.LOVE_DIVINE]: "Love Divine",
  [BandKeys.DANIEL]: "Daniel",
  [BandKeys.DEBORAH]: "Deborah",
  [BandKeys.QUEEN_ESTHER]: "Queen Esther",
  [BandKeys.GOOD_WOMEN]: "Good Women",
  [BandKeys.WARDEN]: "Warden",
  [BandKeys.JOHN_BELOVED]: "John Beloved",
  [BandKeys.FAITH]: "Faith",
  [BandKeys.HOLY_MARY]: "Holy Mary",
  [BandKeys.UNASSIGNED]: "Unassigned",
};

export interface BandConfigEntry {
  id: BandKeys;
  name: string;
  icon: IconType;
  description: string;
  gradient: string[];
}

export type BandConfigRecord = Record<BandKeys, BandConfigEntry>;
