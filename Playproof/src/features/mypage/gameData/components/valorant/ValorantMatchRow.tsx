// src/features/mypage/gameData/components/valorant/ValorantMatchRow.tsx

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import type { ValorantMatchRowVM } from "@/features/mypage/gameData/utils/valorantHenrikMapper";

type Props =
  | { vm: ValorantMatchRowVM }
  | { row: ValorantMatchRowVM | undefined }
  | { vm?: ValorantMatchRowVM; row?: ValorantMatchRowVM };

function AgentBadge({ name }: { name: string }) {
  const text = useMemo(() => {
    if (!name) return "Agent";
    return name.length > 10 ? `${name.slice(0, 10)}…` : name;
  }, [name]);

  return (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-700">
      {text}
    </div>
  );
}

function AgentIcon({
  iconUrl,
  name,
  sizeClass,
  roundedClass,
  emphasize,
}: {
  iconUrl?: string;
  name: string;
  sizeClass: string;
  roundedClass: string;
  emphasize?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const shouldShowImg = !!iconUrl && !broken;

  return (
    <div
      className={[
        "relative overflow-hidden bg-white",
        sizeClass,
        roundedClass,
        emphasize ? "ring-2 ring-gray-800" : "ring-1 ring-gray-200",
      ].join(" ")}
    >
      {shouldShowImg ? (
        <img
          src={iconUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <AgentBadge name={name} />
      )}
    </div>
  );
}

export function ValorantMatchRow(props: Props) {
  const vm = ("vm" in props ? props.vm : props.row) as ValorantMatchRowVM | undefined;
  if (!vm) return null;

  const resultLabel =
    vm.result === "WIN" ? "승리" : vm.result === "LOSS" ? "패배" : "무승부";

  const resultColor =
    vm.result === "WIN"
      ? "text-blue-600"
      : vm.result === "LOSS"
      ? "text-red-600"
      : "text-gray-500";

  return (
    <Card className="flex items-center gap-4 p-4">
      {/* ✅ (변경) 텍스트 블록을 왼쪽으로 */}
      <div className="flex min-w-[120px] flex-col items-center text-center">
        <p className={["text-sm font-semibold", resultColor].join(" ")}>
          {resultLabel}
        </p>

        <p className="text-xs text-gray-500">{vm.durationText || "-"}</p>

        <div className="my-1 h-[2px] w-10 bg-gray-300" />

        <p className="text-xs text-gray-500">{vm.queueTypeText || "-"}</p>
      </div>

      {/* ✅ (변경) 아이콘을 오른쪽으로 */}
      <AgentIcon
        iconUrl={vm.myAgent.iconUrl}
        name={vm.myAgent.name}
        sizeClass="h-14 w-14"
        roundedClass="rounded-md"
        emphasize
      />

      {/* KDA */}
      <div className="min-w-[90px] text-center">
        <p className="text-sm font-medium">{vm.kdaText}</p>
        <p className="text-xs text-gray-500">K / D / A</p>
      </div>

      {/* 우측: 우리팀(상) / 상대팀(하) */}
      <div className="ml-auto flex flex-col gap-1">
        <div className="flex justify-end gap-1">
          {vm.allyAgents.map((a) => (
            <AgentIcon
              key={`ally-${a.id}-${a.name}`}
              iconUrl={a.iconUrl}
              name={a.name}
              sizeClass="h-6 w-6"
              roundedClass="rounded-sm"
            />
          ))}
        </div>

        <div className="flex justify-end gap-1 opacity-70">
          {vm.enemyAgents.map((a) => (
            <AgentIcon
              key={`enemy-${a.id}-${a.name}`}
              iconUrl={a.iconUrl}
              name={a.name}
              sizeClass="h-6 w-6"
              roundedClass="rounded-sm"
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
