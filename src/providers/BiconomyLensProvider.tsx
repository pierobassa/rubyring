import { useAccountStore } from "@/store";
import {
  IBindings,
  LensConfig,
  LensProvider,
  development
} from "@lens-protocol/react-web";
import { ethers } from "ethers";
import React, { createContext, useMemo } from "react";

type BiconomyLensProviderProps = {
  children: React.ReactNode;
};

export const BiconomyLensContext = createContext<boolean>(false);

export const BiconomyLensProvider = ({
  children
}: BiconomyLensProviderProps) => {
  const { smartAccount, accountPrivateKey } = useAccountStore();

  console.log({ smartAccount, accountPrivateKey });

  const biconomyBindings: IBindings | null = useMemo(() => {
    if (!smartAccount || !accountPrivateKey) return null;

    // can't use smartAccount.signer because of this https://github.com/ethers-io/ethers.js/issues/948#issuecomment-1016993929
    const wallet = new ethers.Wallet(accountPrivateKey, smartAccount.provider);

    console.log({ accountPrivateKey });

    return {
      getProvider: async () => smartAccount?.provider,
      getSigner: async () => wallet
    };
  }, [smartAccount, accountPrivateKey]);

  if (!biconomyBindings) return <>{children}</>;

  const lensConfig: LensConfig = {
    bindings: biconomyBindings,
    environment: development
  };

  return (
    <BiconomyLensContext.Provider value={true}>
      <LensProvider config={lensConfig}>{children}</LensProvider>
    </BiconomyLensContext.Provider>
  );
};
