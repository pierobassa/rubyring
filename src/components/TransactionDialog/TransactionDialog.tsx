import { useAccountStore } from "@/store"
import { FormattingUtils } from "@/utils"
import { BigNumber, ethers } from "ethers"
import { useCallback, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { IconContext } from "react-icons"
import { FaGem, FaWallet } from "react-icons/fa"
import { useAccountInfo } from "../../Hooks"
import { Transactions } from "../../Networking"
import { BaseDialog, BaseSeparator } from "../Base"
import { Loader } from "../Loader"

type Props = {
    isBuy: boolean
    amount: number
    userName: string
    userImg: string
    costInEth: BigNumber
    gemSubjectAddress: string
    isOpen: boolean
    openModal: () => void
    closeModal: () => void
    onTxFinish: () => void
}

export default function TransactionDialog({
    isBuy,
    amount,
    userImg,
    userName,
    costInEth,
    gemSubjectAddress,
    isOpen,
    openModal,
    closeModal,
    onTxFinish,
}: Props) {
    const { smartAccount } = useAccountStore()

    const { ethBalance } = useAccountInfo(smartAccount?.owner)

    const userEthBalance = useMemo(() => {
        return ethers.utils.formatEther(ethBalance ?? 0)
    }, [ethBalance])

    const formattedCost = useMemo(() => {
        return FormattingUtils.formatNumberPrecision(
            ethers.utils.formatEther(costInEth),
            8,
        )
    }, [costInEth])

    const [isLoading, setIsLoading] = useState(false)

    const renderTxId = useCallback((txId: string) => {
        return (
            <span>
                Successfully {isBuy ? "bought" : "sold"}!
                <a
                    className="pl-2 cursor-pointer"
                    href={`https://mumbai.polygonscan.com/tx/${txId}`}
                    target="_blank">
                    <u>{FormattingUtils.humanAddress(txId, 4, 6)}</u>
                </a>
            </span>
        )
    }, [])

    const onConfirmClick = useCallback(() => {
        if (!smartAccount) {
            console.error("No smart account")
            return
        }

        if (isBuy) {
            setIsLoading(true)
            toast.promise(
                Transactions.buyGems(
                    gemSubjectAddress,
                    amount,
                    costInEth,
                    smartAccount,
                ),
                {
                    loading: "Your gems are being bought!",
                    success: data => {
                        onTxFinish()
                        setIsLoading(false)
                        return renderTxId(data)
                    },
                    error: err => {
                        onTxFinish()
                        setIsLoading(false)
                        return `Oops! Something went wrong`
                    },
                },
                {
                    success: {
                        duration: 5000,
                    },
                },
            )
        } else {
            // sell
            setIsLoading(true)
            toast.promise(
                Transactions.sellGems(
                    gemSubjectAddress,
                    amount,
                    costInEth,
                    smartAccount,
                ),
                {
                    loading: "Your gems are being sold!",
                    success: data => {
                        onTxFinish()
                        setIsLoading(false)
                        return renderTxId(data)
                    },
                    error: err => {
                        onTxFinish()
                        setIsLoading(false)
                        return `Oops! Something went wrong`
                    },
                },
                {
                    success: {
                        duration: 5000,
                    },
                },
            )
        }
    }, [
        smartAccount,
        isBuy,
        gemSubjectAddress,
        amount,
        costInEth,
        onTxFinish,
        renderTxId,
    ])

    return (
        <BaseDialog
            isOpen={isOpen}
            openModal={openModal}
            closeModal={closeModal}>
            {isLoading ? (
                <div className="flex flex-col items-center justify-center w-full">
                    <Loader />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full bg-stone-600 rounded-2xl py-6 px-4">
                    <p className="text-white font-medium uppercase">
                        {isBuy ? "BUY" : "SELL"} {amount} {userName}
                        {amount > 1 ? " GEMS" : " GEM"}
                    </p>
                    <div className="mt-3 w-full">
                        <div className="flex flex-row items-center justify-center ">
                            <div className="flex flex-row items-center">
                                <IconContext.Provider
                                    value={{ size: "48", color: "#FF89A9" }}>
                                    <FaGem />
                                </IconContext.Provider>
                            </div>
                        </div>

                        <div className="w-full pt-6">
                            <div className="flex items-center justify-center">
                                You will {isBuy ? "Spend" : "Receive"}{" "}
                                {formattedCost} ETH
                            </div>
                        </div>

                        <div className="py-6">
                            <BaseSeparator color="#444444" />
                        </div>

                        <div className="w-full bg-stone-800 rounded-lg ">
                            <div className="w-full flex justify-between items-center px-1 py-1">
                                <div className="pl-2 flex justify-start items-center text-stone-200">
                                    <FaWallet />
                                    <p className="pl-2">
                                        {FormattingUtils.humanAddress(
                                            smartAccount?.owner ?? "",
                                            4,
                                            6,
                                        )}
                                    </p>
                                </div>
                                <div className="bg-[#99324E] rounded-lg py-1">
                                    <div className="py-1 px-3">
                                        {userEthBalance} ETH available
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-center pt-6">
                            <button
                                className="bg-[#FF89A9] flex justify-center items-center hover:brightness-90 rounded-md text-[#2b2b2b] w-full"
                                onClick={onConfirmClick}>
                                <p className="py-2 px-2 font-medium uppercase text-base">
                                    Complete {isBuy ? "Purchase" : "Sale"}
                                </p>
                                <FaGem />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </BaseDialog>
    )
}
