import { useEffect, useState } from "react";

export const useGameState = (
  playerCards: number[],
  dealerCards: number[],
  isGameStarted: boolean,
  isPlayerOver: boolean,
) => {
  const [state, setState] = useState({
    canHit: false,
    canStand: false,
    canDouble: false,
    canSplit: false,
    canSurrender: false,
    canInsurance: false,
  });

  useEffect(() => {
    if (!isGameStarted) {
      setState({
        canHit: false,
        canStand: false,
        canDouble: false,
        canSplit: false,
        canSurrender: false,
        canInsurance: false,
      });
      return;
    }
    if (isPlayerOver) {
      setState(() => ({
        canHit: false,
        canStand: false,
        canDouble: false,
        canSplit: false,
        canSurrender: false,
        canInsurance: false,
      }));
      return;
    }

    const playerTotal = calculateHandValue(playerCards);

    const isBust = typeof playerTotal === "string" && playerTotal.includes("Bust");
    const isBlackjack = playerCards.length === 2 && playerTotal === "21! Blackjack!";

    setState({
      canHit: !isBust && !isBlackjack,
      canStand: !isBust && isGameStarted,
      canDouble: playerCards.length === 2 && !isBust,
      canSplit: playerCards.length === 2 && isPair(playerCards),
      canSurrender: playerCards.length === 2,
      canInsurance: dealerCards.length > 0 && isAce(dealerCards[1]) && playerCards.length === 2 ,
    });
  }, [playerCards, dealerCards, isGameStarted,isPlayerOver]);

  return state;
};

function calculateHandValue(cardIndices: number[]): string | number {
  // 可移除後搬到 utils 共用
  let total = 0;
  let aceCount = 0;

  for (const index of cardIndices) {
    const rank = (index % 13) + 1;

    if (rank === 1) {
      aceCount++;
      total += 11;
    } else if (rank >= 10) {
      total += 10;
    } else {
      total += rank;
    }
  }

  let adjustedTotal = total;
  while (adjustedTotal > 21 && aceCount > 0) {
    adjustedTotal -= 10;
    aceCount--;
  }

  if (adjustedTotal > 21) {
    return `${adjustedTotal} Bust🧨`;
  }

  if (adjustedTotal === 21 && cardIndices.length === 2) {
    return "21! Blackjack!";
  }

  return adjustedTotal;
}

function isPair(cards: number[]): boolean {
  const rank1 = (cards[0] % 13) + 1;
  const rank2 = (cards[1] % 13) + 1;
  return cards.length === 2 && rank1 === rank2;
}

function isAce(cardIndex: number): boolean {
  const rank = (cardIndex % 13) + 1;
  return rank === 1;
}