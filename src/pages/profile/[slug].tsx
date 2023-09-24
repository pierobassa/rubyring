"use client"
import { DEFUALT_USER_IMG_PLACEHOLDER } from "@/constants"
import { useAccountInfo, useDialog, useGemsInfo } from "@/hooks"
import { useRouter } from "next/router"
import { FaGem } from "react-icons/fa"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ethers } from "ethers"
import dynamic from "next/dynamic"
import { BaseSpacer } from "@/components"
import {
    profileId,
    useProfile,
    usePublications,
} from "@lens-protocol/react-web"
import axios from "axios"
import { RubyRingAPI } from "@/Networking"

const TradeDialog = dynamic(
    () =>
        import("../../components/TradeDialog/TradeDialog").then(
            res => res.default,
        ),
    {
        ssr: false,
    },
)

const TransactionDialog = dynamic(
    () =>
        import("../../components/TransactionDialog/TransactionDialog").then(
            res => res.default,
        ),
    {
        ssr: false,
    },
)

const CreatePost = dynamic(
    () =>
        import("../../components/CreatePost/CreatePost").then(
            res => res.default,
        ),
    {
        ssr: false,
    },
)

const Publications = dynamic(
    () =>
        import("../../components/Publications/Publications").then(
            res => res.default,
        ),
    {
        ssr: false,
    },
)

export default function Profile() {
    const { userInfo, smartAccountAddress } = useAccountInfo()

    const router = useRouter()

    // Address of the smart account of the given Lens profile
    const [profileSmartAccountAddress, setProfileSmartAccountAddress] =
        useState<string>("")

    const profileHandle = router.query.slug as string

    const { data: profile, loading } = useProfile({
        handle: profileHandle ?? "",
    })

    const {
        data: publications,
        loading: loadingPublications,
        hasMore,
        next,
        prev,
    } = usePublications({
        profileId: profileId(profile?.id?.toString() ?? ""),
    })

    console.log({
        profile,
        publications,
        loading,
        loadingPublications,
        profileSmartAccountAddress,
    })

    const {
        buyPrice,
        sellPrice,
        gemBalance,
        fetchBuyPrice,
        fetchGemBalance,
        fetchSellPrice,
    } = useGemsInfo(profileSmartAccountAddress, smartAccountAddress ?? "")

    const userGemBalance = useMemo(() => {
        return gemBalance.toNumber()
    }, [gemBalance])

    const buyPriceEther = useMemo(() => {
        return ethers.utils.formatEther(buyPrice)
    }, [buyPrice])

    const sellPriceEther = useMemo(() => {
        return ethers.utils.formatEther(sellPrice)
    }, [sellPrice])

    const {
        isOpen: isTradeDialogOpen,
        openModal: openTradeDialog,
        closeModal: closeTradeDialog,
    } = useDialog()

    const {
        isOpen: isTransactionDialogOpen,
        openModal: openTransactionDialog,
        closeModal: closeTransactionDialog,
    } = useDialog()

    const [isBuy, setIsBuy] = useState(true)

    const onBuyPress = useCallback(() => {
        setIsBuy(true)

        closeTradeDialog()

        openTransactionDialog()
    }, [closeTradeDialog, openTransactionDialog])

    const onSellPress = useCallback(() => {
        setIsBuy(false)

        closeTradeDialog()

        openTransactionDialog()
    }, [closeTradeDialog, openTransactionDialog])

    const onTxFinish = useCallback(() => {
        closeTransactionDialog()
        openTradeDialog()

        fetchBuyPrice()
        fetchSellPrice()
        fetchGemBalance()
    }, [
        closeTransactionDialog,
        fetchBuyPrice,
        fetchGemBalance,
        fetchSellPrice,
        openTradeDialog,
    ])

    const getSmartAccountAddress = useCallback(async () => {
        try {
            const { data, status } = await axios.get(
                RubyRingAPI.GET_RING_DATA_ENDPOINT(profileHandle),
            )

            if (status !== 200) return //TODO

            console.log(data)

            setProfileSmartAccountAddress(data.data[0].smart_account_address)
        } catch (error) {
            console.log(error)
        }
    }, [profileHandle])

    // Fetch the smart account address of the given Lens profile
    useEffect(() => {
        setProfileSmartAccountAddress("")

        getSmartAccountAddress()
        prev()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileHandle])

    console.log({ profileSmartAccountAddress })

    return (
        <div className="w-full pt-6 bg-[#170c10]">
            <div className="max-w-5xl px-4 mx-auto">
                <div className="bg-[#2b2b2b] rounded-md p-4">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center justify-start">
                            <img
                                className="h-14 w-14 md:h-20 md:w-20 rounded-full"
                                src={
                                    // @ts-ignore
                                    profile?.picture?.original?.url ??
                                    DEFUALT_USER_IMG_PLACEHOLDER
                                }
                                alt="user-profile-img"
                            />
                            <div className="pl-2">
                                <p className="font-medium text-base">
                                    {profileHandle}
                                </p>
                                <div className="flex items-center">
                                    <p className="font-light ">
                                        You own {userGemBalance}
                                    </p>
                                    {/* TODO: Replace with balance of gems owned */}
                                    <div className="pl-1">
                                        <FaGem />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#FF89A9] rounded-md text-[#2b2b2b] text-xs md:text-sm">
                            <button
                                className="py-2 px-3 flex items-center justify-between"
                                onClick={openTradeDialog}>
                                <FaGem />
                                <div className="pl-2 font-medium text-base">
                                    BUY GEMS
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <BaseSpacer height={16} />

                {smartAccountAddress === profileSmartAccountAddress && (
                    <CreatePost refetchPublications={prev} />
                )}

                <div className="w-full flex flex-col justify-center items-center mt-6">
                    <div className="w-full md:w-2/3">
                        <Publications
                            publications={publications ?? []}
                            lensHandle={profile?.handle ?? ""}
                            imageUrl={
                                // @ts-ignore
                                profile?.picture?.original?.url ??
                                DEFUALT_USER_IMG_PLACEHOLDER
                            }
                        />
                    </div>
                </div>
                <TradeDialog
                    userName={userInfo?.name ?? ""}
                    userImg={
                        // @ts-ignore
                        profile?.picture?.original?.url ??
                        userInfo?.profileImage ??
                        ""
                    }
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
        </div>
    )
}
