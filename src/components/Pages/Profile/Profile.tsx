"use client";
import {
  useAccountInfo,
  useDisclosure,
  useGemsInfo,
  useResolveEoaAddress
} from "@/hooks";
import { useRouter } from "next/router";
import { FaGem } from "react-icons/fa";
import { useCallback, useMemo, useState } from "react";
import { ethers } from "ethers";
import dynamic from "next/dynamic";
import { BaseSpacer } from "@/components";
import {
  profileId,
  useProfile,
  usePublications
} from "@lens-protocol/react-web";
import { LensUtils } from "@/utils";
import { BeatLoader } from "react-spinners";
import { WithLensContext } from "@/providers";

const TradeDialog = dynamic(
  () =>
    import("@/components/TradeDialog/TradeDialog").then((res) => res.default),
  {
    ssr: false
  }
);

const TransactionDialog = dynamic(
  () =>
    import("@/components/TransactionDialog/TransactionDialog").then(
      (res) => res.default
    ),
  {
    ssr: false
  }
);

const CreatePost = dynamic(
  () =>
    import("@/components/Lens/CreatePost/CreatePost").then(
      (res) => res.default
    ),
  {
    ssr: false
  }
);

const Publications = dynamic(
  () =>
    import("@/components/Lens/Publications/Publications").then(
      (res) => res.default
    ),
  {
    ssr: false
  }
);

const Profile = () => <WithLensContext Component={<ProfileContent />} />;
export default Profile;

function ProfileContent() {
  const { userInfo, smartAccountAddress } = useAccountInfo();

  const router = useRouter();

  // Address of the smart account of the given Lens profile

  const profileHandle = router.query.slug as string;

  const { data: profile, loading } = useProfile({
    handle: profileHandle ?? ""
  });

  //TODO add pagination
  const {
    data: publications,
    loading: loadingPublications,

    // hasMore,
    // next,
    prev
  } = usePublications({
    profileId: profileId(profile?.id?.toString() ?? "")
  });

  const { smartAccountAddress: profileSmartAccountAddress } =
    useResolveEoaAddress(profile?.handle ?? "");

  console.log({
    profile,
    publications,
    loading,
    loadingPublications
  });

  const {
    buyPrice,
    sellPrice,
    gemBalance,
    fetchBuyPrice,
    fetchGemBalance,
    fetchSellPrice
  } = useGemsInfo(profileSmartAccountAddress ?? "", smartAccountAddress ?? "");

  const userGemBalance = useMemo(() => {
    return gemBalance.toNumber();
  }, [gemBalance]);

  const buyPriceEther = useMemo(() => {
    return ethers.utils.formatEther(buyPrice);
  }, [buyPrice]);

  const sellPriceEther = useMemo(() => {
    return ethers.utils.formatEther(sellPrice);
  }, [sellPrice]);

  const {
    isOpen: isTradeDialogOpen,
    onOpen: openTradeDialog,
    onClose: closeTradeDialog
  } = useDisclosure();

  const {
    isOpen: isTransactionDialogOpen,
    onOpen: openTransactionDialog,
    onClose: closeTransactionDialog
  } = useDisclosure();

  const [isBuy, setIsBuy] = useState(true);

  const onBuyPress = useCallback(() => {
    setIsBuy(true);

    closeTradeDialog();

    openTransactionDialog();
  }, [closeTradeDialog, openTransactionDialog]);

  const onSellPress = useCallback(() => {
    setIsBuy(false);

    closeTradeDialog();

    openTransactionDialog();
  }, [closeTradeDialog, openTransactionDialog]);

  const onTxFinish = useCallback(() => {
    closeTransactionDialog();
    openTradeDialog();

    fetchBuyPrice();
    fetchSellPrice();
    fetchGemBalance();
  }, [
    closeTransactionDialog,
    fetchBuyPrice,
    fetchGemBalance,
    fetchSellPrice,
    openTradeDialog
  ]);

  const profilePicture = useMemo(
    () => LensUtils.getProfilePicture(profile),
    [profile]
  );

  console.log({ smartAccountAddress, profileSmartAccountAddress });

  return (
    <div className="w-full pt-6 bg-[#170c10]">
      <div className="max-w-5xl px-4 mx-auto">
        <div className="bg-[#2b2b2b] rounded-md p-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-start">
              <img
                className="h-14 w-14 md:h-20 md:w-20 rounded-full"
                src={profilePicture}
                alt="user-profile-img"
              />
              <div className="flex flex-col gap-2 pl-2">
                <p className="font-bold text-md">{profile?.handle}</p>
                <p className="font-medium text-base">{profile?.id}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <button
                className="py-2 px-3 bg-[#FF89A9] rounded-md text-[#2b2b2b] text-xs md:text-sm flex items-center justify-between"
                onClick={openTradeDialog}
              >
                <FaGem />
                <div className="pl-2 font-medium text-base">BUY GEMS</div>
              </button>
              <div className="flex items-center">
                <p className="font-light ">You own {userGemBalance}</p>
                {/* TODO: Replace with balance of gems owned */}
                <div className="pl-1">
                  <FaGem />
                </div>
              </div>
            </div>
          </div>
        </div>

        <BaseSpacer height={16} />

        {smartAccountAddress === profileSmartAccountAddress && (
          <CreatePost refetchPublications={prev} />
        )}

        <div className="w-full flex flex-col justify-center items-center mt-6">
          <div className="w-full flex flex-col items-center ">
            {loadingPublications ? (
              <BeatLoader
                color={"white"}
                loading={true}
                size={16}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <Publications
                publications={publications ?? []}
                lensHandle={profile?.handle ?? ""}
                imageUrl={profilePicture}
              />
            )}
          </div>
        </div>
        <TradeDialog
          userName={userInfo?.name ?? ""}
          userImg={profilePicture}
          userAddress={smartAccountAddress ?? ""}
          gemSubjectAddress={profileSmartAccountAddress ?? ""}
          isOpen={isTradeDialogOpen}
          buyPriceEther={buyPriceEther}
          sellPriceEther={sellPriceEther}
          gemBalanceEther={userGemBalance}
          onBuyPress={onBuyPress}
          onSellPress={onSellPress}
          openModal={openTradeDialog}
          closeModal={closeTradeDialog}
        />

        <TransactionDialog
          isOpen={isTransactionDialogOpen}
          amount={1}
          closeModal={closeTransactionDialog}
          openModal={openTransactionDialog}
          isBuy={isBuy}
          costInEth={isBuy ? buyPrice : sellPrice}
          userImg={userInfo?.profileImage ?? ""} // TODO replace with the profile's image fetched from BE
          userName={userInfo?.name ?? ""} // TODO replace with the profile's name fetched from BE
          gemSubjectAddress={profileSmartAccountAddress ?? ""}
          onTxFinish={onTxFinish}
        />
      </div>
    </div>
  );
}
