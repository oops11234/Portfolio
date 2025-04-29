import { useEffect, useState } from "react";
import { getContract } from "../utils/contract";

const HelloPage = () => {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      const contract = await getContract();
      const msg = await contract.message();
      setMessage(msg);
    };

    fetchMessage();
  }, []);

  const updateMessage = async () => {
    const contract = await getContract();
    const tx = await contract.setMessage(newMessage);
    await tx.wait(); // 等待交易完成
    alert("訊息更新完成！");
    setNewMessage("");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Hello Sepolia 👋</h1>
      <p className="mt-4">目前訊息：<strong>{message}</strong></p>

      <input
        className="border mt-4 p-2"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="輸入新訊息"
      />
      <button onClick={updateMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        更新訊息
      </button>
    </div>
  );
};

export default HelloPage;
