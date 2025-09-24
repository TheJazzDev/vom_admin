import { BandKeysEnum, DepartmentKeysEnum } from "@/enums";

export const formatPhone = (phone: string) => {
  if (!phone) return "";
  const cleaned = phone.toString().replace(/\D/g, "");
  return cleaned.startsWith("0") ? cleaned : `+234${cleaned}`;
};

export function generateMemberId(
  firstName: string,
  lastName: string,
  dob: string,
): string {
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toLowerCase();

  let day = "00";
  if (dob?.trim() && dob.toLowerCase() !== "date of birth") {
    const match = dob.match(/\d+/);
    day = match ? match[0].padStart(2, "0") : "00";
  }

  const generateAltPattern = (length: number): string => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    let out = "";
    for (let i = 0; i < length; i++) {
      if (i % 2 === 0) {
        out += letters.charAt(Math.floor(Math.random() * letters.length));
      } else {
        out += digits.charAt(Math.floor(Math.random() * digits.length));
      }
    }
    return out;
  };

  const randomSuffix = generateAltPattern(3);
  return `vom-${initials}${day}-${randomSuffix}c`;
}

export function mapBandName(bandName: string): BandKeys | null {
  const normalized = bandName.toLowerCase().trim();

  const mappings: Record<string, BandKeys> = {
    choir: BandKeysEnum.CHOIR,
    "love divine": BandKeysEnum.LOVE_DIVINE,
    daniel: BandKeysEnum.DANIEL,
    deborah: BandKeysEnum.DEBORAH,
    esther: BandKeysEnum.QUEEN_ESTHER,
    "queen esther": BandKeysEnum.QUEEN_ESTHER,
    "good women": BandKeysEnum.GOOD_WOMEN,
    warden: BandKeysEnum.WARDEN,
    "john beloved": BandKeysEnum.JOHN_BELOVED,
    faith: BandKeysEnum.FAITH,
    mary: BandKeysEnum.HOLY_MARY,
    "holy mary": BandKeysEnum.HOLY_MARY,
  };

  // Try exact match first
  if (mappings[normalized]) {
    return mappings[normalized];
  }

  // Try partial matches for common variations
  for (const [key, value] of Object.entries(mappings)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  console.warn(`Unknown band name: "${bandName}"`);
  return null;
}

export function mapDepartmentName(deptName: string): DepartmentKeys | null {
  const normalized = deptName.toLowerCase().trim();
  const mappings: Record<string, DepartmentKeys> = {
    interpretation: DepartmentKeysEnum.INTERPRETATION,
    programme: DepartmentKeysEnum.PROGRAMME,
    media: DepartmentKeysEnum.MEDIA,
    treasury: DepartmentKeysEnum.TREASURY,
    technical: DepartmentKeysEnum.TECHNICAL,
    drama: DepartmentKeysEnum.DRAMA,
    it: DepartmentKeysEnum.IT,
    evangelism: DepartmentKeysEnum.EVANGELISM,
    sanitation: DepartmentKeysEnum.SANITATION,
    secretariat: DepartmentKeysEnum.SECRETARIAT,
  };
  return mappings[normalized] || null;
}
