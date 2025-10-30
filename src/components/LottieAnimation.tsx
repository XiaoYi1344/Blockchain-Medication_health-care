"use client";

import { FC } from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

const LottieAnimation: FC<LottieAnimationProps> = ({
  animationData,
  loop = true,
  autoplay = true,
  className,
}) => {
  return (
    <div className={className}>
      <Lottie animationData={animationData} loop={loop} autoplay={autoplay} />
    </div>
  );
};

export default LottieAnimation;
