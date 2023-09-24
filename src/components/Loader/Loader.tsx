import React from "react";
import { GemLoader } from "../../Assets";
import Lottie from "lottie-react";

export const Loader = () => {
  return (
    <Lottie animationData={GemLoader} style={{ height: "8vh", width: "8vh" }} />
  );
};
