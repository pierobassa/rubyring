import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
} from "@biconomy/account";
import SocialLogin from "@biconomy/web3-auth";
import { ethers } from "ethers";
import { biconomyBundler } from "@/networking";
import { config } from "@/config";

interface AccountState {
  smartAccount?: BiconomySmartAccount;
  smartAccountAddress?: string;
  accountPrivateKey?: string;
  socialLoginSdk?: SocialLogin;
  provider?: ethers.providers.Web3Provider;
  socialAccountLoading: boolean;
  initializeSocialAccount: (sdk: SocialLogin) => Promise<void>;
  setSocialAccountLoading: (isAccountLoading: boolean) => void;
  clear: () => void;
}

export const useAccountStore = create<AccountState>()(
  devtools((set, get) => ({
    smartAccount: undefined,
    smartAccountAddress: undefined,
    accountPrivateKey: undefined,
    socialLoginSdk: undefined,
    provider: undefined,
    socialAccountLoading: false,
    initializeSocialAccount: async (sdk: SocialLogin) => {
      if (!sdk.provider) return;
      set({ ...get(), socialAccountLoading: true });
      const web3Provider = new ethers.providers.Web3Provider(sdk.provider);

      const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        chainId: config.networkId,
        bundler: biconomyBundler,
      };

      let biconomySmartAccount = new BiconomySmartAccount(
        biconomySmartAccountConfig,
      );

      biconomySmartAccount = await biconomySmartAccount.init();

      console.log(
        "deployed: ",
        await biconomySmartAccount.isAccountDeployed(
          await biconomySmartAccount.getSmartAccountAddress(),
        ),
      );
      const smartAccountAddress =
        await biconomySmartAccount.getSmartAccountAddress();
      const privateKey = (await sdk.getPrivateKey()) as string;

      set({
        ...get(),
        socialAccountLoading: false,
        socialLoginSdk: sdk,
        smartAccount: biconomySmartAccount,
        smartAccountAddress,
        accountPrivateKey: privateKey,
        provider: web3Provider,
      });
    },
    setSocialAccountLoading: (isLoading: boolean) =>
      set({ ...get(), socialAccountLoading: isLoading }),
    clear: () =>
      set({
        ...get(),
        smartAccount: undefined,
        smartAccountAddress: undefined,
        accountPrivateKey: undefined,
        socialLoginSdk: undefined,
        provider: undefined,
      }),
  })),
);
