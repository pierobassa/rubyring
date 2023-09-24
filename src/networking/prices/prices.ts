import { BigNumber } from "ethers"
import { CONTRACT } from "../Provider"

export const getSubjectBuyPrice = async (
    accountAddress: string,
    amount: number,
): Promise<BigNumber> => {
    return CONTRACT.getBuyPriceAfterFee(accountAddress, amount)
}

export const getSubjectSellPrice = async (
    accountAddress: string,
    amount: number,
): Promise<BigNumber> => {
    return CONTRACT.getSellPriceAfterFee(accountAddress, amount)
}
