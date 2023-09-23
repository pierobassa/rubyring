"use client";
import { useEffect, useState } from "react";
import { getAccountBalance } from "@/networking";
import { BigNumber } from "ethers";
import { OpenloginUserInfo } from "@toruslabs/openlogin";
import { useAccountStore } from "@/store";

export type AccountInfo = {
  ethBalance?: BigNumber;
  generatedValue?: BigNumber;
  userInfo?: Partial<OpenloginUserInfo> | null;
  account?: string;
  smartAccountAddress?: string;
};

export const useAccountInfo = (accountAddress?: string): AccountInfo => {
  const { smartAccount, socialLoginSdk, smartAccountAddress } =
    useAccountStore();

  const [userInfo, setUserInfo] = useState<
    Partial<OpenloginUserInfo> | null | undefined
  >(null);

  const [ethBalance, setEthBalance] = useState<BigNumber>();

  //TODO: after contract is deployed and implemented
  // const [generatedValue, setGeneratedValue] = useState<BigNumber>();

  useEffect(() => {
    if (!smartAccount) return;

    const getUserInfo = async () => {
      const userInfo = await socialLoginSdk?.getUserInfo();

      setUserInfo(userInfo);
    };

    getUserInfo();
  }, [socialLoginSdk, smartAccount]);

  useEffect(() => {
    if (!accountAddress) return;

    if (!smartAccount) return;

    getAccountBalance(accountAddress ?? smartAccount?.owner)
      .then((balance) => setEthBalance(balance))
      .catch((error) => {
        console.error(error);
      });

    //TODO: after contract is deployed and implemented
    // getFeesGenerated(accountAddress ?? smartAccount?.owner)
    //   .then((generatedValue) => setGeneratedValue(generatedValue))
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }, [smartAccount, accountAddress]);

  return {
    ethBalance,
    // generatedValue,
    userInfo,
    account: smartAccount?.owner,
    smartAccountAddress
  };
};
