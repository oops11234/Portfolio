import { ethers } from "ethers";
import CONTRACT_ABI from "../abi/BlackJack.json";

const CONTRACT_ADDRESS = "0x30ff5ae9c98f8d3b66be5a6b2d3be5b35711ae69";

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