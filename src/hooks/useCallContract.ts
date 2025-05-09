import { ethers } from "ethers";
import CONTRACT_ABI from "../abi/BlackJack.json";

const CONTRACT_ADDRESS = "0xb957db5e482cd63d2e42244594eec09bea22fa0c";

export const getContract = async () => {
  if (!window.ethereum) throw new Error("請安裝 MetaMask");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );

  return contract;
};