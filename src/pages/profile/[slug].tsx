"use client";

import dynamic from "next/dynamic";

// This is to avoid issues with SocialLogin which is not SSR compatible
const ProfilePage = dynamic(
  () => import("@/components/Pages/Profile/Profile").then((res) => res.default),
  {
    ssr: false
  }
);

const Profile = () => <ProfilePage />;
export default Profile;
