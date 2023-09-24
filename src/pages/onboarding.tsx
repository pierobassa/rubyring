import dynamic from "next/dynamic";

// This component does not support ssr so have t declared like this (SocialLogin)
const OnboardingContent = dynamic(
  () => import("@/components/Onboarding/Onboarding").then((mod) => mod.default),
  {
    ssr: false
  }
);

const Onboarding = () => <OnboardingContent />;
export default Onboarding;
