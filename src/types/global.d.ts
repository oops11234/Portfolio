interface EthereumProvider extends Eip1193Provider {
    removeAllListeners?: (...args: any[]) => void;
  }
  
interface Window {
    ethereum?: import("ethers").EthereumProvider;
}