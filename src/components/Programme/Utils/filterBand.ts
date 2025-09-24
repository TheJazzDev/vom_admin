import { bandList } from "../constants/bandList";

// 👇 helper to get band by value
const getBandByValue = (val: string) => bandList.find((b) => b.value === val);

// 👇 enforce gender rules
export const getFilteredBands = (currentValues: string[]) => {
  if (currentValues.length === 0) {
    // first selection: all options available
    return bandList;
  }

  const firstBand = getBandByValue(currentValues[0]);
  if (!firstBand) return [];

  if (firstBand.gender === "MIXED") {
    // If first is MIXED, no other band allowed
    return [];
  }

  if (firstBand.gender === "MEN") {
    // Only allow one WOMEN band, if not already selected
    const alreadyHasWomen = currentValues.some(
      (val) => getBandByValue(val)?.gender === "WOMEN",
    );
    return alreadyHasWomen ? [] : bandList.filter((b) => b.gender === "WOMEN");
  }

  if (firstBand.gender === "WOMEN") {
    // Only allow one MEN band, if not already selected
    const alreadyHasMen = currentValues.some(
      (val) => getBandByValue(val)?.gender === "MEN",
    );
    return alreadyHasMen ? [] : bandList.filter((b) => b.gender === "MEN");
  }

  return [];
};
