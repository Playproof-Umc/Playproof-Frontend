import * as React from "react";
import { cn } from "@/components/utils/cn";

type Step = 1 | 2 | 3;

type StepDotsProps = {
  step?: Step;
  className?: string;
};

const Dot = ({ active, label }: { active?: boolean; label: string }) => {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
        active ? "bg-black text-white" : "bg-[#D9D9D9] text-white"
      )}
    >
      {label}
    </div>
  );
};

const Bar = () => <div className="h-[2px] w-10 bg-[#D9D9D9]" />;

export function StepDots({ step = 1, className }: StepDotsProps) {
  return (
    <div className={cn("mb-5 flex items-center justify-center", className)}>
      <Dot active={step === 1} label="1" />
      <Bar />
      <Dot active={step === 2} label="2" />
      <Bar />
      <Dot active={step === 3} label="3" />
    </div>
  );
}