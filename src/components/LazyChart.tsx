import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

const LazyChart = ({ coinId }: { coinId: string }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
      );
      const data = await res.json();
      const prices = data.prices.map(([timestamp, price]: [number, number]) => ({
        x: timestamp,
        y: price,
      }));

      setChartData({
        datasets: [
          {
            label: `${coinId.toUpperCase()} (USD)`,
            data: prices,
            borderColor: "#ff4d4d",
            backgroundColor: "#ff4d4d",
            fill: false,
            tension: 0.2,
          },
        ],
      });
    };

    fetchData();
  }, [coinId]);

  if (!chartData) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl shadow-md">
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              type: "time",
              time: { unit: "day" },
              ticks: { color: "#ccc" },
              grid: { color: "#333" },
            },
            y: {
              ticks: { color: "#ccc" },
              grid: { color: "#333" },
            },
          },
          plugins: {
            legend: { labels: { color: "#fff" } },
          },
        }}
      />
    </div>
  );
};

export default LazyChart;