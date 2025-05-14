import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import NeonChartWrapper from "./NeonChartWrapper";
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

const ChartOnView = ({ coinId }: { coinId: string }) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     let debounceTimer: NodeJS.Timeout;

    if (inView && !chartData && !loading) {
        debounceTimer = setTimeout(() => {
      setLoading(true);
      fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`)
        .then(res => res.json())
        .then(data => {
          const prices = data.prices.map(([timestamp, price]: [number, number]) => ({
            x: timestamp,
            y: price,
          }));
          setChartData({
            datasets: [
              {
                label: `${coinId.toUpperCase()} / USDT`,
               data: prices,
                    borderColor: '#0ff',
                    borderWidth: 2,
                    pointBackgroundColor: '#0ff',
                    tension: 0.8,
                    pointRadius: 0,
                },
            ],
          });
        })
        .finally(() => setLoading(false));
        }, 500); // 500ms delay
    }
    return () => clearTimeout(debounceTimer);
  }, [inView, chartData, loading, coinId]);

  return (
    <div ref={ref} className="my-12 px-4">
      <NeonChartWrapper>
        {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60">
            <h1 className="neon-red flicker text-[30px] text-center">LOADING...</h1>
        </div>
        )}
        {!loading && chartData && (
           <Line
            data={chartData}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                x: {
                    type: "time",
                    time: { unit: "day" },
                    ticks: { color: "#0ff" },
                    grid: { color: "rgba(0, 255, 255, 0.1)" },
                },
                y: {
                    ticks: { color: "#0ff" },
                    grid: { color: "rgba(0, 255, 255, 0.1)" },
                },
                },
                plugins: {
                legend: {
                    labels: {
                    color: "#0ff",
                    font: { weight: "bold" },
                    },
                },
                },
            }}
            />
        )}
      </NeonChartWrapper>
    </div>
  );
};

export default ChartOnView;