import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyToParty } from '@/services/partyApi';

/**
 * 파티 신청 관리 훅
 */
export const usePartyApplication = () => {
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: (partyId: number) => applyToParty(partyId),
    onSuccess: (data) => {
      alert(data.message || '파티 신청이 완료되었습니다!');
      // 파티 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
    onError: (error: any) => {
      console.error('파티 신청 실패:', error);
      const errorMessage = error.response?.data?.error?.message || '파티 신청에 실패했습니다.';
      alert(errorMessage);
    },
  });

  return {
    applyToParty: applyMutation.mutate,
    isApplying: applyMutation.isPending,
  };
};
