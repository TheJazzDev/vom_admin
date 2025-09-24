type MemberOption = {
  label: string;
  value: string;
};

export function convertBandsToOptions(
  bands: BandWithMembers[],
): MemberOption[] {
  return bands.flatMap((bandGroup) =>
    bandGroup.members.map((member: any) => {
      const fullName =
        `${member.title} ${member.firstName} ${member.lastName}`.trim();

      return {
        label: `${fullName} (${bandGroup.id} band)`,
        value: fullName,
      };
    }),
  );
}
