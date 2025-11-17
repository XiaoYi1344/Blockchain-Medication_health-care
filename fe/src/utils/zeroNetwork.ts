import { ethers } from "ethers";

export const ZERO_RPC_URL = "https://rpc.zeroscan.org"; // testnet endpoint

export const getZeroProvider = () => {
  return new ethers.JsonRpcProvider(ZERO_RPC_URL);
};
