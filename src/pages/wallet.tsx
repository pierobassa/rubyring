"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OpenloginUserInfo } from "@toruslabs/openlogin";
import dynamic from "next/dynamic";
import { useAccountStore } from "@/store";
import { useDisclosure } from "@/hooks";
import { useActiveProfile } from "@lens-protocol/react-web";
import { FormattingUtils } from "@/utils";
import { DEFUALT_USER_IMG_PLACEHOLDER } from "@/constants";

const AccountCard = dynamic(
  () =>
    import("@/components/AccountCard/AccountCard").then((res) => res.default),
  {
    ssr: false
  }
);

const ProfileImageDialog = dynamic(
  () =>
    import("../components/ProfileImageDialog/ProfileImageDialog").then(
      (res) => res.default
    ),
  {
    ssr: false
  }
);

export default function Wallet() {
  const router = useRouter();

  const { smartAccount, socialLoginSdk } = useAccountStore();

  const [userInfo, setUserInfo] = useState<
    Partial<OpenloginUserInfo> | null | undefined
  >(null);

  const {
    isOpen: isUserImageDialogOpen,
    onOpen: openUserImageDialog,
    onClose: closeUserImageDialog
  } = useDisclosure();

  // If the user is not logged in, redirect to the home page
  if (!smartAccount) {
    router.push("/");
  }

  useEffect(() => {
    if (!smartAccount) return;

    const getUserInfo = async () => {
      const userInfo = await socialLoginSdk?.getUserInfo();

      setUserInfo(userInfo);
    };

    getUserInfo();
  }, [socialLoginSdk, smartAccount]);

  const { data: activeProfile } = useActiveProfile();

  const getProfilePicture = useCallback(() => {
    if (!activeProfile) return DEFUALT_USER_IMG_PLACEHOLDER;
    if (activeProfile.picture?.__typename === "MediaSet") {
      const ipfsUrl = FormattingUtils.ipfsUriToHttps(
        activeProfile.picture.original.url
      );
      return ipfsUrl ?? activeProfile.picture.original.url;
    } else {
      return DEFUALT_USER_IMG_PLACEHOLDER;
    }
  }, [activeProfile]);

  return (
    <>
      <div className="pt-12 w-full px-4">
        <AccountCard
          userInfo={userInfo!}
          onProfileImageClick={openUserImageDialog}
          lensProfileImage={getProfilePicture()}
          lensHandle={activeProfile?.handle ?? ""}
        />
      </div>
      <ProfileImageDialog
        isOpen={isUserImageDialogOpen}
        openModal={openUserImageDialog}
        closeModal={closeUserImageDialog}
      />
    </>
  );
}
