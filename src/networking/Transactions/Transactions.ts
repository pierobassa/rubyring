import { BigNumber, Signer, ethers } from "ethers"
import { BiconomySmartAccount } from "@biconomy/account"
import { config } from "../../../config"
import { CONTRACT } from "../Provider"

const sendUserOp = async (
    userOp: any,
    biconomySmartAccount: BiconomySmartAccount,
): Promise<void> => {
    try {
        const userOpResponse = await biconomySmartAccount.sendUserOp(userOp)

        console.log(`userOp Hash: ${userOpResponse.userOpHash}`)

        const transactionDetails = await userOpResponse.wait()

        console.log(
            `transactionDetails: ${JSON.stringify(
                transactionDetails,
                null,
                "\t",
            )}`,
        )
    } catch (e) {
        console.log("error received ", e)
    }
}

export const buyGems = async (
    gemsSubject: string,
    amount: number,
    ethCost: BigNumber,
    smartAccount: BiconomySmartAccount,
): Promise<string> => {
    try {
        // Create the calldata for our UserOperation
        const buyGemsTx = await CONTRACT.populateTransaction.buyGems(
            gemsSubject,
            amount,
        )

        const calldata = buyGemsTx.data

        // Build the UserOperation
        const userOp = await smartAccount.buildUserOp([
            {
                to: config.contractAddress,
                data: calldata,
                value: ethCost,
            },
        ])

        const userOpEstimated = await smartAccount.estimateUserOpGas(userOp)

        console.log(
            `userOpEstimated: ${JSON.stringify(userOpEstimated, null, "\t")}`,
        )

        // Send the UserOperation
        const userOpResponse = await smartAccount.sendUserOp(userOpEstimated)
        const receipt = await userOpResponse.wait()

        console.log(`Transaction receipt: ${JSON.stringify(receipt, null, 2)}`)

        return receipt.receipt.transactionHash
    } catch (e) {
        console.error("error received while sending userOp", e)
        throw e
    }
}

//TODO: extract duplicated code
export const sellGems = async (
    gemsSubject: string,
    amount: number,
    ethCost: BigNumber,
    smartAccount: BiconomySmartAccount,
): Promise<string> => {
    try {
        // Create the calldata for our UserOperation
        const sellGemsTx = await CONTRACT.populateTransaction.sellGems(
            gemsSubject,
            amount,
        )

        const calldata = sellGemsTx.data

        // Build the UserOperation
        const userOp = await smartAccount.buildUserOp([
            {
                to: config.contractAddress,
                data: calldata,
                value: ethCost,
            },
        ])

        const userOpEstimated = await smartAccount.estimateUserOpGas(userOp)

        console.log(
            `userOpEstimated: ${JSON.stringify(userOpEstimated, null, "\t")}`,
        )

        // Send the UserOperation
        const userOpResponse = await smartAccount.sendUserOp(userOpEstimated)
        const receipt = await userOpResponse.wait()

        console.log(`Transaction receipt: ${JSON.stringify(receipt, null, 2)}`)

        return receipt.receipt.transactionHash
    } catch (e) {
        console.error("error received while sending userOp", e)
        throw e
    }
}
