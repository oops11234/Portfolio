import { useEffect, useState } from "react";


export function useMetamaskAccount() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.ethereum) {
      setError("MetaMask 未安裝");
      return;
    }

    const checkAccounts = async () => {
      try {
        const accounts = await window.ethereum?.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (err) {
        setError("無法取得帳戶");
      }
    };

    checkAccounts();

    // 當帳戶變更時觸發
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        setAccount(null);
        setIsConnected(false);
      }
    });

    return () => {
      window.ethereum?.removeAllListeners("accountsChanged");
    };
  }, []);

  const connect = async () => {
    try {
      const accounts = await window.ethereum?.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setError(null);
      }
    } catch (err) {
      setError("使用者拒絕連接或其他錯誤");
    }
  };

  return { account, isConnected, error, connect };
}