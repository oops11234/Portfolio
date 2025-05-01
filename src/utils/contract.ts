import { ethers } from "ethers";
import CONTRACT_ABI from "../abi/BlackJack.json";

const CONTRACT_ADDRESS = "0xea90e7cc12b84563cac02917bc2a5c046d7d2dda";

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