import { BigNumber } from "ethers";
import { alchemyInstance, CONTRACT } from "@/provider";

export const getAccountBalance = async (
  accountAddress: string
): Promise<BigNumber> => {
  return alchemyInstance.core.getBalance(accountAddress);
};

export const getFeesGenerated = async (
  accountAddress: string
): Promise<BigNumber> => {
  return CONTRACT.generatedFees(accountAddress);
};

export const getGemsBalance = async (
  gemSubjectAddress: string,
  accountAddress: string
): Promise<BigNumber> => {
  return CONTRACT.gemsBalance(gemSubjectAddress, accountAddress);
};
