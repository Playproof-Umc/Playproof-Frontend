import React, { useState, useEffect, useRef } from "react";
import { X, Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react"; // AlertCircle 추가
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css"; 

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";

// ---[ 시간 선택기 (변경 없음) ]---
interface TimeSelection {
  ampm: "AM" | "PM";
  hour: number;
  minute: number;
}
interface TimePickerProps {
  value: TimeSelection;
  onChange: (value: TimeSelection) => void;
  isOpen: boolean;
  onToggle: () => void;
  label?: string;
}
const TimePicker = ({ value, onChange, isOpen, onToggle, label }: TimePickerProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const formatTimeView = () => `${value.ampm === "AM" ? "오전" : "오후"} ${value.hour}:${value.minute.toString().padStart(2, "0")}`;
  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button type="button" onClick={onToggle} className={cn("w-full h-12 px-4 rounded-lg border text-sm flex items-center justify-between bg-white transition-colors", isOpen ? "border-black ring-1 ring-black/10" : "border-gray-300 hover:border-gray-400", "text-gray-900")}>
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          {label || formatTimeView()}
        </span>
        <span className="text-[10px] text-gray-400">▼</span>
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex h-48 overflow-hidden text-sm">
          <div className="flex-1 overflow-y-auto border-r border-gray-100 scrollbar-hide">{["AM", "PM"].map((type) => (<div key={type} onClick={() => onChange({ ...value, ampm: type as "AM" | "PM" })} className={cn("py-2 px-3 cursor-pointer text-center hover:bg-gray-50", value.ampm === type && "bg-blue-50 text-blue-600 font-semibold")}>{type === "AM" ? "오전" : "오후"}</div>))}</div>
          <div className="flex-1 overflow-y-auto border-r border-gray-100 scrollbar-hide">{hours.map((h) => (<div key={h} onClick={() => onChange({ ...value, hour: h })} className={cn("py-2 px-3 cursor-pointer text-center hover:bg-gray-50", value.hour === h && "bg-blue-50 text-blue-600 font-semibold")}>{h}</div>))}</div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">{minutes.map((m) => (<div key={m} onClick={() => onChange({ ...value, minute: m })} className={cn("py-2 px-3 cursor-pointer text-center hover:bg-gray-50", value.minute === m && "bg-blue-50 text-blue-600 font-semibold")}>{m.toString().padStart(2, "0")}</div>))}</div>
        </div>
      )}
    </div>
  );
};

// ---[ 메인 컴포넌트 ]---

interface ScheduleCreateModalProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export const ScheduleCreateModal = ({ anchorEl, onClose, onCreate }: ScheduleCreateModalProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const [title, setTitle] = useState("");
  const [recruitCount, setRecruitCount] = useState(0); // 0명이어도 생성 가능 (필요 시 1로 수정)
  const [gameDate, setGameDate] = useState<Date | undefined>(undefined);
  const [isGameDateOpen, setIsGameDateOpen] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<TimeSelection>({ ampm: "AM", hour: 12, minute: 0 });
  const [gameEndTime, setGameEndTime] = useState<TimeSelection>({ ampm: "AM", hour: 12, minute: 0 });
  const [recruitRange, setRecruitRange] = useState<DateRange | undefined>(undefined);
  const [isRecruitDateOpen, setIsRecruitDateOpen] = useState(false);
  const [recruitStartTime, setRecruitStartTime] = useState<TimeSelection>({ ampm: "AM", hour: 12, minute: 0 });
  const [recruitEndTime, setRecruitEndTime] = useState<TimeSelection>({ ampm: "AM", hour: 12, minute: 0 });
  const [activeTimePicker, setActiveTimePicker] = useState<string | null>(null);

  useEffect(() => {
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8, 
        left: rect.left + window.scrollX
      });
    }
  }, [anchorEl]);

  if (!anchorEl) return null;

  const handleRecruitCount = (delta: number) => setRecruitCount((prev) => Math.max(0, prev + delta));
  const formatDate = (date: Date | undefined) => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : "날짜를 선택해주세요.";
  const formatRange = (range: DateRange | undefined) => range?.from ? `${formatDate(range.from)} ~ ${range.to ? formatDate(range.to) : formatDate(range.from)}` : "날짜를 선택해주세요.";

  // ✅ [핵심 수정] 유효성 검사 로직 개선
  const validateForm = () => {
    if (!title.trim()) return { isValid: false, msg: "제목을 입력해주세요." };
    if (!gameDate) return { isValid: false, msg: "게임 일정을 선택해주세요." };
    if (!recruitRange?.from) return { isValid: false, msg: "모집 기간을 선택해주세요." };
    
    // 날짜 비교 시 '시간'을 00:00:00으로 초기화하여 순수 날짜만 비교
    const game = new Date(gameDate);
    game.setHours(0, 0, 0, 0);

    const recruitStart = new Date(recruitRange.from);
    recruitStart.setHours(0, 0, 0, 0);

    // 모집 시작일이 게임일보다 늦으면 안 됨
    if (recruitStart > game) return { isValid: false, msg: "모집 기간이 게임 일정보다 늦습니다." };

    if (recruitRange.to) {
      const recruitEnd = new Date(recruitRange.to);
      recruitEnd.setHours(0, 0, 0, 0);
      // 모집 종료일이 게임일보다 늦으면 안 됨
      if (recruitEnd > game) return { isValid: false, msg: "모집 종료일은 게임 일정 이전이어야 합니다." };
    }

    return { isValid: true, msg: "" };
  };

  const { isValid, msg } = validateForm();

  const handleSubmit = () => {
    if (!isValid) return;
    onCreate({ title, recruitCount, gameDate, gameStartTime, gameEndTime, recruitRange, recruitStartTime, recruitEndTime });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-transparent" onClick={onClose} />
      
      <div 
        className="absolute z-[101] bg-white rounded-2xl w-[520px] shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]"
        style={{ top: position.top, left: position.left }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 p-1.5 rounded-lg">
               <CalendarIcon className="w-5 h-5 text-gray-600" />
            </span>
            <h2 className="text-lg font-bold text-gray-900">스케줄 생성</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-6 scrollbar-hide">
          {/* 1. 제목 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-900">제목</label>
            <Input variant="light" placeholder="최대 20글자" maxLength={20} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* 2. 모집 인원 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-900">모집 인원</label>
            <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 h-12">
              <button onClick={() => handleRecruitCount(-1)} className="text-gray-400 hover:text-black text-xl font-medium px-2">-</button>
              <span className="font-bold text-lg">{recruitCount}</span>
              <button onClick={() => handleRecruitCount(1)} className="text-gray-400 hover:text-black text-xl font-medium px-2">+</button>
            </div>
          </div>

          {/* 3. 게임 일정 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-900">게임 일정</label>
            <div className="grid grid-cols-1 gap-2">
              <div className="relative">
                <button onClick={() => setIsGameDateOpen(!isGameDateOpen)} className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white flex items-center justify-between text-sm text-gray-900 hover:border-gray-400">
                  <span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-gray-400" />{formatDate(gameDate)}</span>
                  <span className="text-[10px] text-gray-400">▼</span>
                </button>
                {isGameDateOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white border rounded-xl shadow-xl z-50 p-2">
                    <DayPicker mode="single" selected={gameDate} onSelect={(date) => { setGameDate(date); setIsGameDateOpen(false); }} styles={{ head_cell: { width: "40px" }, cell: { width: "40px" } }} />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <TimePicker value={gameStartTime} onChange={setGameStartTime} isOpen={activeTimePicker === 'gameStart'} onToggle={() => setActiveTimePicker(activeTimePicker === 'gameStart' ? null : 'gameStart')} />
                <TimePicker value={gameEndTime} onChange={setGameEndTime} isOpen={activeTimePicker === 'gameEnd'} onToggle={() => setActiveTimePicker(activeTimePicker === 'gameEnd' ? null : 'gameEnd')} />
              </div>
            </div>
          </div>

          {/* 4. 인원 모집 기간 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-900">인원 모집 기간</label>
            <div className="grid grid-cols-1 gap-2">
               <div className="relative">
                <button onClick={() => setIsRecruitDateOpen(!isRecruitDateOpen)} className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white flex items-center justify-between text-sm text-gray-900 hover:border-gray-400">
                  <span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-gray-400" />{formatRange(recruitRange)}</span>
                  <span className="text-[10px] text-gray-400">▼</span>
                </button>
                {isRecruitDateOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white border rounded-xl shadow-xl z-50 p-2">
                    <DayPicker mode="range" selected={recruitRange} onSelect={setRecruitRange} numberOfMonths={1} styles={{ head_cell: { width: "40px" }, cell: { width: "40px" } }} />
                    <div className="flex justify-end p-2 border-t mt-2"><button onClick={() => setIsRecruitDateOpen(false)} className="text-blue-600 text-sm font-bold">적용</button></div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <TimePicker value={recruitStartTime} onChange={setRecruitStartTime} isOpen={activeTimePicker === 'recruitStart'} onToggle={() => setActiveTimePicker(activeTimePicker === 'recruitStart' ? null : 'recruitStart')} />
                <TimePicker value={recruitEndTime} onChange={setRecruitEndTime} isOpen={activeTimePicker === 'recruitEnd'} onToggle={() => setActiveTimePicker(activeTimePicker === 'recruitEnd' ? null : 'recruitEnd')} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white flex flex-col gap-2">
          {/* ✅ 에러 메시지 표시 (디버깅용) */}
          {!isValid && msg && (
            <div className="flex items-center gap-2 text-red-500 text-xs px-1">
              <AlertCircle className="w-3 h-3" />
              <span>{msg}</span>
            </div>
          )}
          <Button fullWidth variant={isValid ? "primary" : "secondary"} disabled={!isValid} onClick={handleSubmit} className="h-12 text-base rounded-xl">업로드</Button>
        </div>
      </div>
    </>
  );
};