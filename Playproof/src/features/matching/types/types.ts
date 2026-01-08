export interface MatchingData {
  id: number;
  game: string;
  title: string;
  tier: string;
  tags: string[];
  
  azit: string;      
  position: string[]; // [변경] 단일 문자열 -> 문자열 배열 (여러 개 선택)
  memo: string;       // [추가] 사용자가 작성한 본문 내용

  currentMembers: number;
  maxMembers: number;
  time: string;
  views: number;
  likes: number;
  comments: number;
  tsScore: number;
  hostUser: {
    id: string | number;
    nickname: string;
    avatarUrl?: string;
  };
}