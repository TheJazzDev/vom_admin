import { programmesRef } from '@/config';
import { addDoc } from 'firebase/firestore';

// export interface SaveProgrammeData
//   extends Omit<ProgrammeFormData, 'id' | 'createdAt' | 'updatedAt'> {}

export const saveProgramme = async (
  programmeData: ProgrammeFormData,
  userId: string
): Promise<string> => {
  const now = new Date().toISOString();

  const data = {
    ...programmeData,
    createdAt: now,
    createdBy: userId,
    ...(programmeData.status === 'draft' && { updatedAt: now }),
  };

  try {
    const docRef = await addDoc(programmesRef, data);

    return docRef.id;
  } catch (error) {
    console.error('Error saving programme:', error);
    throw new Error('Failed to save programme');
  }
};
