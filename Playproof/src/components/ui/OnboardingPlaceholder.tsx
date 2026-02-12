// src/components/ui/OnboardingPlaceholder.tsx

import { useState, useEffect } from "react";
import landing01 from "@/assets/onboarding/landing-01.svg";
import landing02 from "@/assets/onboarding/landing-02.svg";
import landing03 from "@/assets/onboarding/landing-03.svg";
import landing04 from "@/assets/onboarding/landing-04.svg";
import landing05 from "@/assets/onboarding/landing-05.svg";
import landing06 from "@/assets/onboarding/landing-06.svg";

const ONBOARDING_IMAGES = [
  landing01,
  landing02,
  landing03,
  landing04,
  landing05,
  landing06,
];

interface OnboardingPlaceholderProps {
  activeIndex?: number;
  onIndexChange?: (index: number) => void;
}

export const OnboardingPlaceholder = ({ 
  activeIndex = 0,
  onIndexChange 
}: OnboardingPlaceholderProps) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);

  useEffect(() => {
    setCurrentIndex(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  return (
    <div className="relative w-full h-[480px] overflow-hidden rounded-sm bg-[#f3f3f3]">
      {ONBOARDING_IMAGES.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`온보딩 이미지 ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};