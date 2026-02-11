import { api } from "@/services/api";
import type { Azit } from "@/features/team/types/types";

type AzitResDto = {
  azit_id: number;
  azit_name: string;
  azit_icon_url: string | null;
};

type AzitListResponse = {
  statusCode: number;
  data: { azits: AzitResDto[] };
  error: null | unknown;
};

export async function getAzits(): Promise<Azit[]> {
  const res = await api.get<AzitListResponse>("/azits");
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error("아지트 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const azits = res.data.data?.azits ?? [];
  return azits.map((item) => ({
    id: item.azit_id,
    name: item.azit_name,
    icon: item.azit_icon_url ?? "",
    memberCount: 0,
  }));
}

type AzitUpdateResponse = {
  statusCode: number;
  data: AzitResDto;
  error: null | unknown;
};

export async function updateAzit(
  azitId: number,
  payload: { azit_name?: string | null; azit_icon?: File | string | null; is_delete_icon?: boolean }
): Promise<AzitResDto> {
  const hasName = payload.azit_name !== undefined;
  const hasFile = payload.azit_icon instanceof File;
  const hasDeleteFlag = payload.is_delete_icon !== undefined;

  if (hasName && !hasFile && !hasDeleteFlag) {
    const res = await api.patch<AzitUpdateResponse>(`/azits/${azitId}`, {
      azit_name: payload.azit_name ?? "",
    });
    if (res.data.error || res.data.statusCode !== 200) {
      throw new Error("아지트 설정 변경에 실패했습니다.");
    }
    return res.data.data;
  }

  const formData = new FormData();
  if (payload.azit_name !== undefined) formData.append("azit_name", payload.azit_name ?? "");
  if (payload.is_delete_icon !== undefined) formData.append("is_delete_icon", String(payload.is_delete_icon));
  if (payload.azit_icon instanceof File) {
    formData.append("azit_icon", payload.azit_icon);
  }

  const res = await api.patch<AzitUpdateResponse>(`/azits/${azitId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error("아지트 설정 변경에 실패했습니다.");
  }
  return res.data.data;
}
