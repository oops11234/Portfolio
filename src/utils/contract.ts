import { ethers } from "ethers";
import CONTRACT_ABI from "../abi/BlackJack.json";

const CONTRACT_ADDRESS = "0x5dd7839a1c06cab36bf9742bf9b9e49126762aa4";

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