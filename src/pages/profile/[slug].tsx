"use client";
import { useRouter } from "next/router";
import { useActiveProfile, useProfile } from "@lens-protocol/react-web";
import { WithLensContext } from "@/providers";
import { LensProfileCard } from "@/components/Lens/LensProfileCard";
import { BaseSpacer } from "@/components/Base/BaseSpacer";
import {
  useAccountInfo,
  useDialog,
  useGemsInfo,
  useResolveEoaAddress
} from "@/hooks";
import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ethers } from "ethers";

const TradeDialog = dynamic(
  () =>
    import("../../components/TradeDialog/TradeDialog").then(
      (res) => res.default
    ),
  {
    ssr: false
  }
);

const TransactionDialog = dynamic(
  () =>
    import("../../components/TransactionDialog/TransactionDialog").then(
      (res) => res.default
    ),
  {
    ssr: false
  }
);

const CreatePost = dynamic(
  () =>
    import("../../components/CreatePost/CreatePost").then((res) => res.default),
  {
    ssr: false
  }
);

const Profile = () => <WithLensContext Component={<ProfileComponent />} />;
export default Profile;

const ProfileComponent = () => {
  const { userInfo, smartAccountAddress } = useAccountInfo();
  const router = useRouter();

  // Address of the smart account of the given Lens profile

  const profileHandle = router.query.slug as string;

  const { smartAccountAddress: profileSmartAccountAddress } =
    useResolveEoaAddress(profileHandle);

  //TODO: handle loading state
  const {
    data: profile
    // loading
  } = useProfile({
    handle: profileHandle ?? ""
  });

  const { data: activeProfile } = useActiveProfile();

  console.log({ profile });

  const {
    buyPrice,
    sellPrice,
    gemBalance,
    fetchBuyPrice,
    fetchGemBalance,
    fetchSellPrice
  } = useGemsInfo(profileSmartAccountAddress, smartAccountAddress ?? "");

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
    openModal: openTradeDialog,
    closeModal: closeTradeDialog
  } = useDialog();

  const {
    isOpen: isTransactionDialogOpen,
    openModal: openTransactionDialog,
    closeModal: closeTransactionDialog
  } = useDialog();

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

  if (!profile || !activeProfile) {
    return <h1 className="font-bold text2xl">Profile not found</h1>;
  }

  return (
    <div>
      <LensProfileCard
        cardClassName="max-w-5xl px-4 mx-auto bg-[#2b2b2b] rounded-md p-4 mt-8 "
        profile={profile}
        activeProfile={activeProfile}
        renderFollowButton={true}
      />
      <BaseSpacer height={16} />

      <CreatePost />

      <TradeDialog
        userName={userInfo?.name ?? ""}
        userImg={userInfo?.profileImage ?? ""}
        userAddress={smartAccountAddress ?? ""}
        gemSubjectAddress={profileSmartAccountAddress}
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
        gemSubjectAddress={profileSmartAccountAddress}
        onTxFinish={onTxFinish}
      />
    </div>
  );
};
