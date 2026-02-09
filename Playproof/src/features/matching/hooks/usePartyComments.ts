import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPartyComments,
  createPartyComment,
  updateComment,
  deleteComment,
  type GetCommentsParams,
  type CreateCommentRequest,
  type UpdateCommentRequest,
} from '@/services/partyApi';

/**
 * 파티 댓글 관리 훅
 */
export const usePartyComments = (partyId: number, params?: GetCommentsParams) => {
  const queryClient = useQueryClient();

  // 댓글 목록 조회
  const {
    data: commentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['partyComments', partyId, params],
    queryFn: () => getPartyComments(partyId, params),
    enabled: !!partyId,
  });

  // 댓글 작성
  const createMutation = useMutation({
    mutationFn: (data: CreateCommentRequest) => createPartyComment(partyId, data),
    onSuccess: () => {
      // 댓글 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['partyComments', partyId] });
    },
  });

  // 댓글 수정
  const updateMutation = useMutation({
    mutationFn: ({ commentId, data }: { commentId: number; data: UpdateCommentRequest }) =>
      updateComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partyComments', partyId] });
    },
  });

  // 댓글 삭제
  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partyComments', partyId] });
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
