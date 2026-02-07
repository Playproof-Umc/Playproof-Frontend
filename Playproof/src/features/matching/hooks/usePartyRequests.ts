// src/features/matching/hooks/usePartyRequests.ts

//src/features/matching/hooks/usePartyRequests.ts
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// [Mock Data] 
interface Applicant {
  id: number;
  game: string;
  title: string;
  user: string; 
  userId: string; 
  ts: number;
  time: string;
}

const INITIAL_APPLICANTS: Applicant[] = [
  { id: 1, game: '오버워치', title: '경쟁다인큐 구합니다 TS 90이상', user: '레나', userId: 'user-2', ts: 90, time: '10분 전' },
  { id: 2, game: '배틀그라운드', title: '오늘 치킨 먹자', user: '치킨마스터', userId: 'user-3', ts: 80, time: '5분 전' },
  { id: 3, game: 'Steam', title: 'Lethal Company 같이 할 분', user: 'MonsterHunter', userId: 'user-4', ts: 50, time: '1분 전' },
  { id: 4, game: '리그오브레전드', title: '칼바람 나락 ㄱㄱ', user: '페이커팬', userId: 'user-5', ts: 95, time: '방금 전' },
];

export const usePartyRequests = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);

  // 정렬 
  const sortedApplicants = useMemo(() => {
    return [...applicants].sort((a, b) => {
      if (a.game === 'Steam') return -1;
      if (b.game === 'Steam') return 1;
      return a.game.localeCompare(b.game);
    });
  }, [applicants]);

  // 배너 문구 생성
  const getBannerDescription = () => {
    if (sortedApplicants.length === 0) return '';
    const latestUser = sortedApplicants[0].user;
    const otherCount = applicants.length - 1;
    return otherCount > 0 
      ? `${latestUser} 님 외 ${otherCount}명이 파티 합류를 대기 중입니다.`
      : `${latestUser} 님이 파티 합류를 대기 중입니다.`;
  };

  // 핸들러
  const toggleOpen = () => setIsOpen(!isOpen);

  const handleRemove = (id: number) => {
    setApplicants((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAcceptAll = () => setApplicants([]);
  const handleRejectAll = () => setApplicants([]);

  const handleMoveToProfile = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    navigate(`/user/${userId}`);
  };

  return {
    state: {
      isOpen,
      applicants,
      sortedApplicants,
      bannerDescription: getBannerDescription(),
      count: applicants.length
    },
    actions: {
      toggleOpen,
      handleRemove,
      handleAcceptAll,
      handleRejectAll,
      handleMoveToProfile
    }
  };
};