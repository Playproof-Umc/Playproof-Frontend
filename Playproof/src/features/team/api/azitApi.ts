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
