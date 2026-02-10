import { Card } from "@/components/ui/Card";
import type { LolMatchItem } from "@/features/mypage/gameData/types/gameDataTypes";

// ✅ Props 타입을 MatchDto가 아닌 LolMatchItem으로 변경 (에러 해결 핵심)
type Props = {
  match: LolMatchItem;
  // myPuuid는 이제 필요 없음 (이미 뷰모델에 내 정보가 들어있음)
};

const getChampImg = (name: string) =>
  `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${name}.png`;

export const MatchRow = ({ match }: Props) => {
  const isWin = match.result === "win";
  
  // 스타일링 분기
  const cardStyle = isWin
    ? "border-l-4 border-l-blue-500 bg-blue-50/30 hover:bg-blue-50/60"
    : "border-l-4 border-l-red-500 bg-red-50/30 hover:bg-red-50/60";
  const textStyle = isWin ? "text-blue-600" : "text-red-600";
  const bgBadge = isWin ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700";

  return (
    <Card className={`px-4 py-3 transition-colors ${cardStyle}`}>
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* 1. 왼쪽: 승패 / 시간 / 구분선 / 게임 종류 */}
        <div className="flex w-[80px] flex-col gap-1 shrink-0">
          <div className={`text-sm font-bold ${textStyle}`}>
            {isWin ? "승리" : "패배"}
          </div>
          <div className="text-[11px] text-gray-500">{match.durationText}</div>
          
          {/* 🔍 복구된 얇은 바 */}
          <div className={`h-[2px] w-6 my-1 ${isWin ? "bg-blue-200" : "bg-red-200"}`} />
          
          <div className="text-[11px] font-medium text-gray-600">{match.queueLabel}</div>
        </div>

        {/* 2. 내 챔피언 이미지 + KDA */}
        <div className="flex items-center gap-3 w-[160px] shrink-0">
          <div className="relative">
            <img
              src={getChampImg(match.myChampionName)}
              alt={match.myChampionName}
              className="h-12 w-12 rounded-lg object-cover bg-gray-200"
            />
            {/* 아이템 개수 뱃지 */}
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-[10px] text-white">
              {match.itemsCount}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-sm font-bold text-gray-900 tracking-tight">
              {match.kdaText}
            </div>
            <div className="text-[11px] text-gray-500">
              {match.kdaRatioText}
            </div>
          </div>
        </div>

        {/* 3. 태그 (Pills) */}
        <div className="hidden sm:flex flex-col gap-1 w-[80px] shrink-0">
          {match.pills.map((p) => (
            <span key={p} className={`w-fit rounded px-1.5 py-0.5 text-[10px] font-medium ${bgBadge}`}>
              {p}
            </span>
          ))}
        </div>

        {/* 4. ✨ 복구된 챔피언 리스트 (우리팀 vs 적팀) */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-6">
          {/* 우리팀 */}
          <div className="flex gap-0.5">
            {match.teamChampions.map((champ, i) => (
              <img 
                key={`${match.id}-team-${i}`}
                src={getChampImg(champ)}
                alt={champ}
                className="h-6 w-6 rounded border border-gray-300 bg-gray-200"
                title={champ}
              />
            ))}
          </div>

          {/* VS 텍스트 */}
          <div className="text-[10px] text-gray-400 font-bold">VS</div>

          {/* 적팀 */}
          <div className="flex gap-0.5">
            {match.opponentChampions.map((champ, i) => (
              <img 
                key={`${match.id}-enemy-${i}`}
                src={getChampImg(champ)}
                alt={champ}
                className="h-6 w-6 rounded border border-red-200 bg-red-50"
                title={champ}
              />
            ))}
          </div>
        </div>

      </div>
    </Card>
  );
};
