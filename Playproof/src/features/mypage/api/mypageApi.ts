// src/features/mypage/api/mypageApi.ts

import type {
  BlockedUserData,
  FeedbackData,
  FriendData,
  MyPostsData,
  MyProfileData,
} from '@/features/mypage/types';
import {
  fetchMyProfile as mockFetchMyProfile,
  fetchMyFeedbacks as mockFetchMyFeedbacks,
  fetchMyPosts as mockFetchMyPosts,
  fetchFriends as mockFetchFriends,
  fetchBlockedUsers as mockFetchBlockedUsers,
} from '@/features/mypage/data/mockMyPageData';

/**
 * 내 프로필 정보 조회
 */
export async function getMyProfile(): Promise<MyProfileData> {
  // TODO: 실제 API로 교체
  // return await fetch('/api/mypage/profile').then(res => res.json());
  return await mockFetchMyProfile();
}

/**
 * 받은 피드백 목록 조회
 */
export async function getMyFeedbacks(): Promise<FeedbackData[]> {
  // TODO: 실제 API로 교체
  // return await fetch('/api/mypage/feedbacks').then(res => res.json());
  return await mockFetchMyFeedbacks();
}

/**
 * 내가 작성한 글 목록 조회
 */
export async function getMyPosts(): Promise<MyPostsData> {
  // TODO: 실제 API로 교체
  // return await fetch('/api/mypage/posts').then(res => res.json());
  return await mockFetchMyPosts();
}

/**
 * 친구 목록 조회
 */
export async function getFriends(): Promise<FriendData[]> {
  // TODO: 실제 API로 교체
  // return await fetch('/api/mypage/friends').then(res => res.json());
  return await mockFetchFriends();
}

/**
 * 차단 사용자 목록 조회
 */
export async function getBlockedUsers(): Promise<BlockedUserData[]> {
  // TODO: 실제 API로 교체
  // return await fetch('/api/mypage/blocked-users').then(res => res.json());
  return await mockFetchBlockedUsers();
}

/**
 * 친구 삭제
 */
export async function removeFriend(userId: string): Promise<void> {
  // TODO: 실제 API로 교체
  // await fetch(`/api/mypage/friends/${userId}`, { method: 'DELETE' });
  console.log('친구 삭제:', userId);
  await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * 친구 추가
 */
export async function addFriend(userId: string, message?: string): Promise<void> {
  // TODO: 실제 API로 교체
  // await fetch('/api/mypage/friends', { 
  //   method: 'POST', 
  //   body: JSON.stringify({ userId, message }) 
  // });
  console.log('친구 추가:', { userId, message });
  await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * 차단 해제
 */
export async function unblockUser(userId: string): Promise<void> {
  // TODO: 실제 API로 교체
  // await fetch(`/api/mypage/blocked-users/${userId}`, { method: 'DELETE' });
  console.log('차단 해제:', userId);
  await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * 신고 제출
 */
export async function submitReport(data: {
  targetUserId: string;
  reportType: string;
  name: string;
  email: string;
  title: string;
  content: string;
  images?: File[];
  videos?: File[];
}): Promise<void> {
  // TODO: 실제 API로 교체
  // const formData = new FormData();
  // Object.entries(data).forEach(([key, value]) => {
  //   if (Array.isArray(value)) {
  //     value.forEach(file => formData.append(key, file));
  //   } else {
  //     formData.append(key, value);
  //   }
  // });
  // await fetch('/api/mypage/reports', { method: 'POST', body: formData });
  console.log('신고 제출:', data);
  await new Promise(resolve => setTimeout(resolve, 300));
}
