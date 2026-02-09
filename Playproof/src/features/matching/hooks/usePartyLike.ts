import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeParty } from '@/services/partyApi';

/**
 * 파티 좋아요 관리 훅
 */
export const usePartyLike = () => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: (partyId: number) => likeParty(partyId),
    onSuccess: (data, partyId) => {
      // 파티 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      // 파티 상세 정보도 업데이트
      queryClient.invalidateQueries({ queryKey: ['party', partyId] });
    },
    onError: (error: any) => {
      console.error('좋아요 처리 실패:', error);
      alert(error.response?.data?.error?.message || '좋아요 처리에 실패했습니다.');
    },
  });

  return {
    toggleLike: likeMutation.mutate,
    isLiking: likeMutation.isPending,
  };
};
