import { CIDString } from "node_modules/web3.storage";

export const getWeb3StorageLink = (CID: CIDString) => {
  return `https://${CID}.ipfs.w3s.link/`;
};
