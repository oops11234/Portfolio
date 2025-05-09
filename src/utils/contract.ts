import { ethers } from "ethers";
import CONTRACT_ABI from "../abi/BlackJack.json";

const CONTRACT_ADDRESS = "0xb5D480B9c3E9223184c9E0635A610137d790709C";

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