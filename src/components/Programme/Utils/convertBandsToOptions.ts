import { BandKeys } from '@/enums';
import { BandDisplayNames } from '@/enums/bands';
import { DocumentData } from 'firebase/firestore';

type MemberOption = {
  label: string;
  value: string;
};

export function convertBandsToOptions(
  bands: {
    bandKey: BandKeys;
    members: DocumentData[];
  }[]
): MemberOption[] {
  return bands.flatMap((bandGroup) =>
    bandGroup.members.map((member: any) => {
      const fullName =
        `${member.title} ${member.firstName} ${member.lastName}`.trim();
      const primaryBand = BandDisplayNames[bandGroup.bandKey];

      return {
        label: `${fullName} (${primaryBand} band)`,
        value: fullName,
      };
    })
  );
}
