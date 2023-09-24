import React from "react";
import { SuccessAnimation } from "@/assets";
import Lottie from "lottie-react";

export const SuccessAnimationLottie = () => {
  return (
    <Lottie
      animationData={SuccessAnimation}
      style={{ height: "32vh", width: "32vh" }}
    />
  );
};
