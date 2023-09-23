"use client";

import { WithLensContext } from "./WithLensContext";
import { useAccountStore } from "@/store";
import {
  useActiveWallet,
  useProfilesOwnedByMe,
  useWalletLogin
} from "@lens-protocol/react-web";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRouter as useRouterPath } from "next/router";

export const CreateLensAccountHandler = () => (
  <WithLensContext Component={<CreateLensAccountComponent />} />
);

function CreateLensAccountComponent() {
  const { smartAccount, setLensAccount, lensAccount } = useAccountStore();

  const router = useRouter();

  const pathRouter = useRouterPath();

  //TODO: handle loading
  const {
    data: activeWallet
    // loading: activeWalletLoading
  } = useActiveWallet();

  //TODO: handle login
  const {
    execute: login,
    error: loginError
    // isPending: isLoginPending
  } = useWalletLogin();

  //TODO: handle pagination
  const {
    data: profiles
    // loading: profilesOwnedLoading,
    // hasMore,
    // next
  } = useProfilesOwnedByMe({
    limit: 10
  });

  useEffect(() => {
    const handleLensLogin = async (address: string) => {
      try {
        await login({
          address
        });
        console.log("lens login success");
      } catch (error) {
        console.error("lens login failed", error);
      }
    };
    if (!activeWallet && smartAccount?.owner)
      handleLensLogin(smartAccount.owner);
  }, [smartAccount?.owner, activeWallet]);

  useEffect(() => {
    if (loginError) {
      console.error("lens login failed", loginError);
    }
  }, [loginError]);

  // set lens account to shared account state
  useEffect(() => {
    if (!profiles) return;

    // if (profiles.length === 0 && !pathRouter.pathname.includes("onboarding")) {
    //   router.push("/onboarding");
    //   return;
    // }
    if (profiles.length > 0 && !lensAccount) {
      setLensAccount(profiles[0]);
    }
  }, [lensAccount, pathRouter.pathname, profiles, router, setLensAccount]);

  useEffect(() => {
    if (!profiles) return;

    if (profiles.length === 0) return;

    if (profiles[0].handle === lensAccount?.handle) return;

    setLensAccount(profiles[0]);
  }, [profiles, setLensAccount]);

  console.log({ profiles });

  return <></>;
}
