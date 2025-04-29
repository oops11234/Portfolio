export function scoreCount  (score: string | number): number  {
    if (typeof score === "number") return score;
  
    if (typeof score === "string") {
      if (score.includes("/")) {
        // 例如 "10 / 20"
        const parts = score.split("/").map((s) => parseInt(s.trim()));
        return Math.max(...parts);
      } else if (score.includes("Bust")) {
        // 爆牌
        return parseInt(score);
      } else {
        return parseInt(score);
      }
    }
  
    return 0;
  };