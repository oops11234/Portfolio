type ConnectModalProps = {
  onConnect: () => void;
  onClose: () => void;
};

export default function ConnectModal({ onConnect, onClose }: ConnectModalProps) {
  return (
    <div className="fixed inset-0 bg-[#000000c8] flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center text-[#000000]">Connect To wallet</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConnect}
            className="px-6 py-2 rounded-md bg-black text-white hover:bg-blue-500 cursor-pointer transition-colors duration-200"
          >
            MetaMask
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700  hover:underline text-sm text-center"
          >
            Cancel (Test Mode)
          </button>
        </div>
      </div>
    </div>
  );
}