import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeParty } from '@/services/partyApi';

/**
 * 파티 좋아요 관리 훅
 */
export const usePartyLike = () => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: (partyId: number) => likeParty(partyId),
    onMutate: async (partyId) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['parties'] });

      // 이전 데이터 백업
      const previousParties = queryClient.getQueryData(['parties']);

      // 옵티미스틱 업데이트: 파티 목록의 좋아요 상태 즉시 변경
      queryClient.setQueryData(['parties'], (old: any) => {
        if (!old?.data?.parties) return old;
        
        return {
          ...old,
          data: {
            ...old.data,
            parties: old.data.parties.map((party: any) => {
              if (party.partyId === partyId) {
                const isCurrentlyLiked = party.isLike ?? false;
                return {
                  ...party,
                  isLike: !isCurrentlyLiked,
                  likeCount: isCurrentlyLiked 
                    ? (party.likeCount ?? 1) - 1 
                    : (party.likeCount ?? 0) + 1,
                };
              }
              return party;
            }),
          },
        };
      });

      return { previousParties };
    },
    onSuccess: (_data, _partyId) => {
      // 서버 응답으로 최종 상태 동기화
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
    onError: (error: any, _partyId, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousParties) {
        queryClient.setQueryData(['parties'], context.previousParties);
      }
      console.error('좋아요 처리 실패:', error);
      alert(error.response?.data?.error?.message || '좋아요 처리에 실패했습니다.');
    },
    onSettled: () => {
      // 최종적으로 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
  });

  return {
    toggleLike: likeMutation.mutate,
    isLiking: likeMutation.isPending,
  };
};
