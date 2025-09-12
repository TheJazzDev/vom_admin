import { saveProgramme } from '@/services/programmeService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export const programmesKeys = {
  all: ['programmes'] as const,
  lists: () => [...programmesKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) =>
    [...programmesKeys.lists(), filters] as const,
  details: () => [...programmesKeys.all, 'detail'] as const,
  detail: (id: string) => [...programmesKeys.details(), id] as const,
  search: (term: string) => [...programmesKeys.all, 'search', term] as const,
  drafts: () => [...programmesKeys.all, 'drafts'] as const,
  published: () => [...programmesKeys.all, 'published'] as const,
};

export const useSaveProgramme = () => {
  const userId = 'asdfavewacwds';
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProgrammeFormData) => saveProgramme(data, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: programmesKeys.all });
      queryClient.invalidateQueries({
        queryKey:
          variables.status === 'draft'
            ? programmesKeys.drafts()
            : programmesKeys.published(),
      });

      // Show success message
      toast.success(
        variables.status === 'draft'
          ? 'Programme saved as draft'
          : 'Programme published successfully'
      );

      router.push(`/programme`);
    },
    onError: (error) => {
      toast.error(`Failed to save programme: ${error}`);
      console.error('Failed to save programme:', error);
      toast.error('Failed to save programme. Please try again.');
    },
  });
};
