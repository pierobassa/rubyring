import { ChainId } from "@biconomy/core-types";
import { Network } from "alchemy-sdk";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

const deployedContract = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

/**
 * This is the app config file. It contains all the configuration required for the app to run.
 */
export const config = {
  alchemyNetworkName: Network.MATIC_MUMBAI,
  networkName: "maticmum",
  networkId: ChainId.POLYGON_MUMBAI,
  bundlerUrl: `https://bundler.biconomy.io/api/v2/${ChainId.POLYGON_MUMBAI}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`, // This is the bundler url for Polygon Mumbai network. (https://docs.biconomy.io/docs/Biconomy%20AA%20Stack/Bundler/initialization)
  rpcUrl: rpcUrl ?? "",
  contractAddress: deployedContract ?? "",
};
