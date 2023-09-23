import { LoggedInAccount } from "@/components/SocialLoginWrapper/LoggedInAccount";
import { useAccountStore } from "@/store";
import { ChainId } from "@biconomy/core-types";
import SocialLogin from "@biconomy/web3-auth";
import { ethers } from "ethers";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { FaArrowRightToBracket } from "react-icons/fa6";

const productionUrl = "https://rubyring-zeta.vercel.app/";

export const SocialLoginWrapper = memo(() => <SocialLoginContent />);

SocialLoginWrapper.displayName = "SocialLoginWrapper";

const SocialLoginContent = () => {
  const {
    smartAccountAddress,
    socialLoginSdk,
    socialAccountLoading,
    initializeSocialAccount,
    clear: clearAccount
  } = useAccountStore();

  const [isIntervalEnabled, setIsIntervalEnabled] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const sdkRef = useRef<SocialLogin | undefined>(socialLoginSdk);

  const handleLogout = async () => {
    if (!sdkRef.current) {
      console.error("SDK not initialized");
      return;
    }

    await sdkRef.current.logout();
    sdkRef.current.hideWallet();
    clearAccount();
    setIsIntervalEnabled(false);
  };

  const handleInitializeSocialAccount = useCallback(
    async (sdk: SocialLogin) => {
      try {
        initializeSocialAccount(sdk);
        sdk.hideWallet();
      } catch (e: unknown) {
        console.error("Error while iniitalizing wallet", e);
      }
    },
    [initializeSocialAccount]
  );

  const handleLogin = useCallback(async () => {
    try {
      if (!sdkRef.current) {
        setLoginLoading(true);
        const sdk = new SocialLogin();

        const signature1 = await sdk.whitelistUrl(
          "http://127.0.0.1:3000/" // TODO: It is important to make sure that you update the whitelist URL with your production url when you are ready to go live!
        );

        const productionSignature = await sdk.whitelistUrl(productionUrl);

        await sdk.init({
          chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
          network: "testnet",
          whitelistUrls: {
            "http://127.0.0.1:3000/": signature1,
            [productionUrl]: productionSignature
          }
        });
        sdkRef.current = sdk;
        setLoginLoading(false);
      }

      console.log("sdk", sdkRef.current);

      if (sdkRef.current?.provider)
        return handleInitializeSocialAccount(sdkRef.current);

      sdkRef.current?.showWallet(); // It will show the widget in your UI
      setIsIntervalEnabled(true); //triggers useEffect to setup smart account
    } catch (e: unknown) {
      console.error("unable to initialize SocialLogin", e);
    }
  }, [sdkRef, setIsIntervalEnabled, handleInitializeSocialAccount]);

  useEffect(() => {
    let configureLogin: NodeJS.Timeout | undefined;
    if (isIntervalEnabled) {
      configureLogin = setInterval(() => {
        if (sdkRef.current?.provider) {
          handleInitializeSocialAccount(sdkRef.current);
          clearInterval(configureLogin);
        }
      }, 1000);
    }
    return () => {};
  }, [isIntervalEnabled, handleInitializeSocialAccount]);

  console.log("RERENDER");

  if (smartAccountAddress)
    return (
      <LoggedInAccount address={smartAccountAddress} onLogout={handleLogout} />
    );

  return (
    <button
      disabled={socialAccountLoading || loginLoading}
      className="px-4 py-2 bg-[#FF89A9] rounded-md hover:enabled:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleLogin}
    >
      {socialAccountLoading || loginLoading ? (
        <BeatLoader
          color={"white"}
          loading={true}
          size={8}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div className="flex items-center ">
          <FaArrowRightToBracket
            className="h-6 w-6 text-[#2b2b2b]"
            aria-hidden="true"
          />
          <div className="text-[#2b2b2b] pl-1 font-medium">Join</div>
        </div>
      )}
    </button>
  );
};
