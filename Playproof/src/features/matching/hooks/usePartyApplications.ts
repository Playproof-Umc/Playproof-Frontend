import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPartyApplications, updateApplication } from '@/services/partyApi';

/**
 * 파티 신청자 관리 훅
 */
export const usePartyApplications = (partyId?: number) => {
  const queryClient = useQueryClient();

  // 신청자 목록 조회
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['partyApplications', partyId],
    queryFn: () => partyId ? getPartyApplications(partyId) : Promise.resolve([]),
    enabled: !!partyId,
    staleTime: 30 * 1000,
  });

  // 신청 수락/거절
  const updateMutation = useMutation({
    mutationFn: ({ applicationId, isAccepted }: { applicationId: number; isAccepted: boolean }) =>
      updateApplication(applicationId, { isAccepted }),
    onSuccess: (data, variables) => {
      const action = variables.isAccepted ? '수락' : '거절';
      alert(`신청을 ${action}했습니다.`);
      // 신청자 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['partyApplications', partyId] });
      // 파티 목록도 새로고침 (참가 인원 변경)
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
    onError: (error: any) => {
      console.error('신청 처리 실패:', error);
      alert(error.response?.data?.error?.message || '신청 처리에 실패했습니다.');
    },
  });

  // 수락
  const acceptApplication = (applicationId: number) => {
    updateMutation.mutate({ applicationId, isAccepted: true });
  };

  // 거절
  const rejectApplication = (applicationId: number) => {
    updateMutation.mutate({ applicationId, isAccepted: false });
  };

  // 전체 수락
  const acceptAll = () => {
    applications.forEach((app) => {
      updateMutation.mutate({ applicationId: app.applicationId, isAccepted: true });
    });
  };

  // 전체 거절
  const rejectAll = () => {
    applications.forEach((app) => {
      updateMutation.mutate({ applicationId: app.applicationId, isAccepted: false });
    });
  };

  return {
    applications,
    isLoading,
    acceptApplication,
    rejectApplication,
    acceptAll,
    rejectAll,
    isProcessing: updateMutation.isPending,
  };
};
