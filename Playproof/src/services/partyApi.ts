import { api } from "@/services/api";

// ==================== Types ====================

export type PartyListParams = {
  page?: number;
  size?: number;
  sort?: 'latest' | 'mostliked';
};

export type PartyListItem = {
  partyId: number;
  gameId: number;
  host: {
    id: number;
    nickname: string;
    trustScore: number;
    avatarUrl: string | null;
  };
  title: string;
  memo: string;
  tierName: string;
  azitName: string;
  participants: number;
  currentParticipants: number;
  isMic: boolean;
  status: string;
  viewCount: number;
  likeCount?: number;
  isLike?: boolean;
  commentCount?: number;
  tags: Array<{ id: number; name: string }>;
  positions: Array<{ positionId: number; positionName: string }>;
  createdAt: string;
  updatedAt: string;
};

export type PartyListResponse = {
  statusCode: number;
  data: {
    parties: PartyListItem[];
    nextCursor: number | null;
    hasNext: boolean;
  };
  error: null | unknown;
};

export type PartyDetail = {
  partyId: number;
  gameId: number;
  host: {
    id: number;
    nickname: string;
    trustScore: number;
    avatarUrl: string | null;
  };
  title: string;
  memo: string;
  tierName: string;
  azitName: string;
  participants: number;
  currentParticipants: number;
  isMic: boolean;
  status: string;
  viewCount: number;
  likeCount?: number;
  commentCount?: number;
  tags: Array<{ id: number; name: string }>;
  positions: Array<{ positionId: number; positionName: string }>;
  createdAt: string;
  updatedAt: string;
};

export type PartyDetailResponse = {
  statusCode: number;
  data: PartyDetail;
  error: null | unknown;
};

export type CreatePartyRequest = {
  gameId: number;
  title: string;
  memo: string;
  recruitmentPeople: number;
  tierId: number;
  positionIds: number[];
  isMicUse: boolean;
  azitId: number;
};

export type CreatePartyResponse = {
  statusCode: number;
  data: {
    partyId: number;
    userId: number;
    gameId: number;
    title: string;
    memo: string;
    recruitmentPeople: number;
    tierId: number;
    positionIds: number[];
    isMicUse: boolean;
    azitId: number;
    azitName: string;
    azitIconUrl: string;
    createdAt: string;
  };
  error: null | unknown;
};

export type UpdatePartyRequest = {
  gameId: number;
  title: string;
  memo: string;
  recruitmentPeople: number;
  tierId: number;
  positionIds: number[];
  isMicUse: boolean;
  azitId: number;
};

export type UpdatePartyResponse = CreatePartyResponse;

export type DeletePartyResponse = {
  statusCode: number;
  data: {
    partyId: number;
    message: string;
    deletedAt: string;
  };
  error: null | unknown;
};

// ==================== Party Interaction Types ====================

export type ApplyPartyResponse = {
  statusCode: number;
  data: {
    applicationId: number;
    partyId: number;
    status: string;
    createdAt: string;
    message: string;
  };
  error: null | unknown;
};

export type UpdateApplicationRequest = {
  isAccepted: boolean;
};

export type UpdateApplicationResponse = {
  statusCode: number;
  data: {
    applicationId: number;
    partyId: number;
    status: string;
    updatedAt: string;
    message: string;
  };
  error: null | unknown;
};

export type CancelApplicationResponse = {
  statusCode: number;
  data: {
    message: string;
    partyId: number;
    updatedAt: string;
  };
  error: null | unknown;
};

export type LikePartyResponse = {
  statusCode: number;
  data: {
    partyId: number;
    isLiked: boolean;
    message: string;
  };
  error: null | unknown;
};

// ==================== Party Comment Types ====================

export type PartyComment = {
  commentId: number;
  userId: number;
  nickname: string;
  content: string;
  createdAt: string;
  parentId: number | null;
  replies?: PartyComment[];
};

export type GetCommentsParams = {
  page?: number;
  limit?: number;
};

export type GetCommentsResponse = {
  statusCode: number;
  data: {
    comments: PartyComment[];
    meta: {
      limit: number;
      totalComments: number;
      totalPages: number;
      currentPage: number;
    };
  };
  error: null | unknown;
};

export type CreateCommentRequest = {
  content: string;
  parentId?: number | null;
};

export type CommentResponse = {
  statusCode: number;
  data: {
    commentId: number;
    partyId: number;
    userId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    message?: string;
    deletedAt?: string;
  };
  error: null | unknown;
};

export type UpdateCommentRequest = {
  content: string;
};

export type DeleteCommentResponse = CommentResponse;

// ==================== API Functions ====================

/**
 * 파티 목록 조회
 * GET /parties
 */
export async function getParties(params?: PartyListParams): Promise<PartyListResponse['data']> {
  const res = await api.get<PartyListResponse>("/parties", {
    params: {
      page: params?.page ?? 1,
      size: params?.size ?? 10,
      sort: params?.sort ?? 'latest',
    },
  });

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('파티 목록을 불러오는 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 파티 상세 조회
 * GET /parties/{id}
 */
export async function getPartyDetail(id: number): Promise<PartyDetail> {
  const res = await api.get<PartyDetailResponse>(`/parties/${id}`);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('파티 정보를 불러오는 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 파티 생성
 * POST /parties
 */
export async function createParty(body: CreatePartyRequest): Promise<CreatePartyResponse['data']> {
  const res = await api.post<CreatePartyResponse>("/parties", body);

  if (res.data.error || res.data.statusCode !== 201) {
    throw new Error('파티 생성 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 파티 수정
 * PATCH /parties/{id}
 */
export async function updateParty(id: number, body: UpdatePartyRequest): Promise<UpdatePartyResponse['data']> {
  const res = await api.patch<UpdatePartyResponse>(`/parties/${id}`, body);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('파티 수정 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 파티 삭제
 * DELETE /parties/{id}
 */
export async function deleteParty(id: number): Promise<DeletePartyResponse['data']> {
  const res = await api.delete<DeletePartyResponse>(`/parties/${id}`);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('파티 삭제 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

// ==================== Party Interaction API Functions ====================

/**
 * 파티 신청
 * POST /parties/{postId}/applications
 */
export async function applyToParty(postId: number): Promise<ApplyPartyResponse['data']> {
  const res = await api.post<ApplyPartyResponse>(`/parties/${postId}/applications`);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('파티 신청 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 파티 신청 수락/거절
 * PATCH /parties/applications/{applicationId}
 */
export async function updateApplication(
  applicationId: number, 
  body: UpdateApplicationRequest
): Promise<UpdateApplicationResponse['data']> {
  const res = await api.patch<UpdateApplicationResponse>(
    `/parties/applications/${applicationId}`, 
    body
  );

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('신청 처리 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 파티 신청 취소
 * DELETE /parties/applications/{applicationId}
 */
export async function cancelApplication(applicationId: number): Promise<CancelApplicationResponse['data']> {
  const res = await api.delete<CancelApplicationResponse>(`/parties/applications/${applicationId}`);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('신청 취소 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 파티 좋아요
 * POST /parties/{postId}/likes
 */
export async function likeParty(postId: number): Promise<LikePartyResponse['data']> {
  const res = await api.post<LikePartyResponse>(`/parties/${postId}/likes`);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('좋아요 처리 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

// ==================== Party Comment API Functions ====================

/**
 * 파티 댓글 목록 조회
 * GET /parties/{partyId}/comments
 */
export async function getPartyComments(
  partyId: number, 
  params?: GetCommentsParams
): Promise<GetCommentsResponse['data']> {
  const res = await api.get<GetCommentsResponse>(`/parties/${partyId}/comments`, {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    },
  });

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('댓글 목록을 불러오는 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 파티 댓글 작성
 * POST /parties/{partyId}/comments
 */
export async function createPartyComment(
  partyId: number, 
  body: CreateCommentRequest
): Promise<CommentResponse['data']> {
  const res = await api.post<CommentResponse>(`/parties/${partyId}/comments`, body);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('댓글 작성 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 댓글 수정
 * PATCH /comments/{commentId}
 */
export async function updateComment(
  commentId: number, 
  body: UpdateCommentRequest
): Promise<CommentResponse['data']> {
  const res = await api.patch<CommentResponse>(`/comments/${commentId}`, body);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('댓글 수정 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 댓글 삭제
 * DELETE /comments/{commentId}
 */
export async function deleteComment(commentId: number): Promise<DeleteCommentResponse['data']> {
  const res = await api.delete<DeleteCommentResponse>(`/comments/${commentId}`);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('댓글 삭제 중 오류가 발생했습니다.');
  }

  return res.data.data;
}
