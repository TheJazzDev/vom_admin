type BandRole =
  | "Captain"
  | "Choir Master"
  | "Vice Captain"
  | "Assistant Choir Master"
  | "Secretary"
  | "Member";

interface BandData {
  name: BandKeys;
  role: BandRole;
}

interface DisplayBand {
  key: BandKeys;
  displayName: string;
  role: BandRole;
  roleDisplay: string;
}

interface BandWithDetailsProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon: typeof Ionicons;
  gradient: GradientColor;
  members: UserProfile[];
}
