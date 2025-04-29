type ConnectModalProps = {
  onConnect: () => void;
  onClose: () => void;
};

export default function ConnectModal({ onConnect, onClose }: ConnectModalProps) {
  return (
    <div className="fixed inset-0 bg-[#000000c8] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center text-[#000000]">Connect To wallet</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConnect}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
          >
            MetaMask
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}