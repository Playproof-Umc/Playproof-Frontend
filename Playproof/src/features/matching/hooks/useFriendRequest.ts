import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendFriendRequest } from '@/services/friendApi';

/**
 * 친구 신청 훅
 */
export const useFriendRequest = () => {
  const queryClient = useQueryClient();

  const friendRequestMutation = useMutation({
    mutationFn: (toUserId: number) => sendFriendRequest(toUserId),
    onSuccess: (data) => {
      alert(`친구 신청이 완료되었습니다. (상태: ${data.friendStatus})`);
      // 친구 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'sent'] });
    },
    onError: (error: any) => {
      console.error('친구 신청 실패:', error);
      const errorMessage = error.response?.data?.error?.message || '친구 신청에 실패했습니다.';
      alert(errorMessage);
    },
  });

  return {
    sendRequest: friendRequestMutation.mutate,
    isSending: friendRequestMutation.isPending,
  };
};
