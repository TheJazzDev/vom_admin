import { linkToParents } from "./findAndLinkParent";
import { generateChildId } from "./utils";

// Parse CSV row to ChildrenProfile with parent linking
export async function parseChildRowToProfile(
  row: any[],
  _rowIndex: number,
): Promise<ChildrenProfile> {
  const [
    _serial, // Column A
    title, // Column B
    firstName, // Column C
    middleName, // Column D
    lastName, // Column E
    gender, // Column F
    dob, // Column G
    parentPhones, // Column H - Parent Phone
  ] = row;

  const childId = generateChildId(firstName || "", lastName || "", dob || "");

  // Link to parents using phone numbers
  const parentInfo = await linkToParents(parentPhones || "");

  console.log(`Linking child ${firstName} ${lastName} to parents:`, parentInfo);

  return {
    id: childId,
    avatar: "",
    title: title || "",
    firstName: firstName || "",
    middleName: middleName || "",
    lastName: lastName || "",
    gender: gender?.toLowerCase() === "male" ? "male" : "female",
    dob: dob || "",
    ...parentInfo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
