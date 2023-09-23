import { Alchemy } from "alchemy-sdk";
import { ethers } from "ethers";
import { config } from "@/config";

const ALCHEMY_API_KEY = process.env.NEXT_PLUBIC_ALCHEMY_API_KEY;

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

// const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: config.alchemyNetworkName
};

// Create a new instance of Alchemy which will be used for all calls to the blockchain
export const alchemyInstance = new Alchemy(settings);

export const infuraProvider = new ethers.providers.InfuraProvider(
  { name: config.networkName, chainId: config.networkId },
  INFURA_API_KEY
);

// export const CONTRACT = new ethers.Contract(
//   CONTRACT_ADDRESS ?? "",
//   CONTRACT_ABI.abi,
//   infuraProvider
// );
