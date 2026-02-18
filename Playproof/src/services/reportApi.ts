import { api } from './api';

// 신고 전체 조회 (페이지네이션)
export async function getReports({
  page = 1,
  size = 10,
  sort = 'latest',
}: {
  page?: number;
  size?: number;
  sort?: 'latest' | 'oldest';
} = {}) {
  const res = await api.get('/reports', {
    params: { page, size, sort },
  });
  return res.data?.data;
}

// 신고 생성
export async function createReport(formData: FormData) {
  const res = await api.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data;
}

// 신고 상세 조회
export async function getReportDetail(reportId: number) {
  const res = await api.get(`/reports/${reportId}`);
  return res.data?.data;
}

// 신고 수정
export async function updateReport(reportId: number, formData: FormData) {
  const res = await api.patch(`/reports/${reportId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data;
}

// 신고 삭제
export async function deleteReport(reportId: number) {
  const res = await api.delete(`/reports/${reportId}`);
  return res.data?.data;
}
