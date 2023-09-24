"use client";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import {
  getGemsBalance,
  getSubjectBuyPrice,
  getSubjectSellPrice
} from "@/networking";

export const useGemsInfo = (gemSubject: string, accountAddress: string) => {
  const [buyPrice, setBuyPrice] = useState<BigNumber>(BigNumber.from(0));
  const [sellPrice, setSellPrice] = useState<BigNumber>(BigNumber.from(0));
  const [gemBalance, setGemBalance] = useState<BigNumber>(BigNumber.from(0));

  // Pricing after fees

  const fetchBuyPrice = useCallback(async () => {
    if (!gemSubject) return;

    const buyPrice = await getSubjectBuyPrice(gemSubject, 1);

    setBuyPrice(buyPrice);
  }, [gemSubject]);

  const fetchSellPrice = useCallback(async () => {
    if (!gemSubject) return;

    const sellPrice = await getSubjectSellPrice(gemSubject, 1);

    setSellPrice(sellPrice);
  }, [gemSubject]);

  const fetchGemBalance = useCallback(async () => {
    if (!gemSubject || !accountAddress) return;

    const gemBalance = await getGemsBalance(gemSubject, accountAddress);

    setGemBalance(gemBalance);
  }, [gemSubject, accountAddress]);

  useEffect(() => {
    if (!gemSubject || !accountAddress) return;

    getSubjectBuyPrice(gemSubject, 1).then(setBuyPrice).catch(console.error);

    getSubjectSellPrice(gemSubject, 1).then(setSellPrice).catch(console.error);

    getGemsBalance(gemSubject, accountAddress)
      .then(setGemBalance)
      .catch(console.error);
  }, [accountAddress, gemSubject]);

  return {
    buyPrice,
    sellPrice,
    gemBalance,
    fetchBuyPrice,
    fetchSellPrice,
    fetchGemBalance
  };
};
