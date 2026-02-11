import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPartyComments,
  createPartyComment,
  updateComment,
  deleteComment,
  type GetCommentsParams,
  type CreateCommentRequest,
  type UpdateCommentRequest,
  type PartyComment,
} from '@/services/partyApi';

/**
 * 파티 댓글 관리 훅
 */
export const usePartyComments = (partyId: number, params?: GetCommentsParams) => {
  const queryClient = useQueryClient();
  const queryKey = ['partyComments', partyId, params];

  // 댓글 목록 조회
  const {
    data: commentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => getPartyComments(partyId, params),
    enabled: !!partyId,
  });

  // 댓글 작성 (Optimistic Update 적용)
  const createMutation = useMutation({
    mutationFn: (data: CreateCommentRequest) => createPartyComment(partyId, data),
    onMutate: async (newComment) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 데이터 스냅샷
      const previousComments = queryClient.getQueryData(queryKey);

      // Optimistic Update: 임시 댓글 추가
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        
        const tempComment: PartyComment = {
          commentId: Date.now(), // 임시 ID
          userId: 0, // 현재 사용자 ID
          nickname: '나',
          content: newComment.content,
          createdAt: new Date().toISOString(),
          parentId: newComment.parentId ?? null,
          replies: [],
        };

        return {
          ...old,
          comments: [...old.comments, tempComment],
          meta: {
            ...old.meta,
            totalComments: old.meta.totalComments + 1,
          },
        };
      });

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      // 에러 시 이전 상태로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 최종적으로 서버 데이터로 동기화
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // 댓글 수정
  const updateMutation = useMutation({
    mutationFn: ({ commentId, data }: { commentId: number; data: UpdateCommentRequest }) =>
      updateComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // 댓글 삭제 (Optimistic Update 적용)
  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousComments = queryClient.getQueryData(queryKey);

      // Optimistic Update: 댓글 즉시 제거
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments.filter((c: PartyComment) => c.commentId !== commentId),
          meta: {
            ...old.meta,
            totalComments: old.meta.totalComments - 1,
          },
        };
      });

      return { previousComments };
    },
    onError: (err, commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    // 데이터
    comments: commentsData?.comments ?? [],
    meta: commentsData?.meta,
    
    // 상태
    isLoading,
    error,
    
    // 액션
    refetch,
    createComment: createMutation.mutate,
    updateComment: updateMutation.mutate,
    deleteComment: deleteMutation.mutate,
    
    // 뮤테이션 상태
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
