import { Web3Storage } from "node_modules/web3.storage";

const WEB3_STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;

export const web3StorageClient = new Web3Storage({
  token: WEB3_STORAGE_TOKEN ?? ""
});
