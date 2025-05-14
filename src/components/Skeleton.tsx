const RedSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800/40 rounded-xl p-6 animate-pulse shadow-md border-2 border-red-500">
      <div className="h-6 bg-red-500/40 rounded w-1/3 mb-4" />
      <div className="h-[300px] bg-red-500/10 rounded" />
    </div>
  );
};

export default RedSkeleton;