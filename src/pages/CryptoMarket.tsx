import ChartWrapper from "../components/ChartWrapper";

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-black mt-[80px] text-white px-4 py-10">
      <h1 className="text-4xl text-center font-bold mb-12 text-neon">
        The Blockchain Ticker
      </h1>

      <ChartWrapper coinId="bitcoin" />
      <ChartWrapper coinId="ethereum" />
      <ChartWrapper coinId="solana" />
      <ChartWrapper coinId="dogecoin" />
    </div>
  );
}