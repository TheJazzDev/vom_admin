export function generateChildId(
  firstName: string,
  lastName: string,
  dob: string,
): string {
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toLowerCase();

  let day = "00";
  if (dob?.trim()) {
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
  return `vom-${initials}${day}-${randomSuffix}a`;
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.toString().replace(/\D/g, "");
  return cleaned.startsWith("0") ? cleaned : `0${cleaned}`;
}

export function calculateCurrentAge(dob: string): number {
  if (!dob || !dob.trim()) return 0;

  try {
    const today = new Date();
    const birthDate = new Date(dob);

    if (Number.isNaN(birthDate.getTime())) {
      // Handle partial dates like "June 12" - assume current year minus reasonable age
      const currentYear = today.getFullYear();
      const dobWithYear = `${dob} ${currentYear}`;
      const birthDateWithYear = new Date(dobWithYear);

      if (!Number.isNaN(birthDateWithYear.getTime())) {
        let age = today.getFullYear() - birthDateWithYear.getFullYear();
        const monthDiff = today.getMonth() - birthDateWithYear.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDateWithYear.getDate())
        ) {
          age--;
        }

        return age >= 0 && age <= 18 ? age : 0;
      }
    } else {
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= 0 ? age : 0;
    }
  } catch (error) {
    console.error("Error calculating age:", error);
  }

  return 0;
}
