import { useEffect, useState } from "react";
import getCardImage from "../utils/getCardImage"; // 假設這是一個函數，用於獲取卡片的圖片路徑
import { createShuffledDeck } from "../utils/createShuffledDeck"; // 假設這是一個函數，用於創建洗牌後的牌組
import { scoreCount } from "../utils/scoreCount";
import { getContract } from "../hooks/useCallContract"; // 假設這是一個函數，用於獲取合約實例
import { useGameState } from "../hooks/useGameState"; // 假設這是一個自定義的 Hook，用於管理遊戲狀態
import ConnectModal from "../components/ConnectModal";
import { ethers } from "ethers"; // 引入 ethers.js 庫

const BlackjackTable = () => {
  // demo modal controller
  const [showConnectModal, setShowConnectModal] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [withContract, setWithContract] = useState<boolean>(false);

  const [deck, setDeck] = useState<number[]>([]);


  const [playerBetAmount, setPlayerBetAmount] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<number>(0); // 下注金額
  const [realBetAmount, setRealBetAmount] = useState<number>(0); // 實際下注金額
  

  // data controller
  const [dealerRawCards, setDealerRawCards] = useState<number[]>([]);
  const [playerRawCards, setPlayerRawCards] = useState<number[]>([]); 

  const [dealerScore, setDealerScore] = useState<string>("");
  const [playerScore, setPlayerScore] = useState<string>("");

  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [playerCards, setPlayerCards] = useState<string[]>([]);

  
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false); // 遊戲是否開始
  const [isPlayerOver, setIsPlayerOver] = useState<boolean>(false); 
  const [isDealerDrawing, setIsDealerDrawing] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false); // 遊戲是否結束


  const gameState = useGameState(playerRawCards, dealerRawCards, isGameStarted, isPlayerOver); // 使用自定義的 Hook 來獲取遊戲狀態


  useEffect(() => {
  }, [deck]);
  
  // render cards
  const calculateHandValue = (cardIndices: number[]): string | number => {
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
    let softAceUsed:boolean = false;
    console.log(softAceUsed);
  
    while (adjustedTotal > 21 && aceCount > 0) {
      adjustedTotal -= 10;
      aceCount--;
      softAceUsed = true;
    }

    if (adjustedTotal > 21) {
      return `${adjustedTotal} Bust🧨`; // 
    }

    if (adjustedTotal === 21 && cardIndices.length === 2) {
      return "21! Blackjack!";
    }
  
    // 如果目前仍有 Ace 被當作 11，就顯示 soft hand（例如 "5 / 15"）
    if (aceCount > 0 && (adjustedTotal !== total || total === adjustedTotal)) {
      const low = adjustedTotal - 10;
      if (low > 0 && adjustedTotal !== low) {
        return `${low} / ${adjustedTotal}`;
      }
    }
  
    return adjustedTotal;
  }
  const transformCard = (cardIndex: number) => {
    const suits = ['C', 'D', 'H', 'S']; // 梅花、方塊、紅心、黑桃
    const suitIndex = Math.floor(cardIndex / 13);
    const cardValue = (cardIndex % 13) + 1; // 1~13
    const suitPrefix = suits[suitIndex];
    return `${suitPrefix}_${cardValue}`;
  }
  const renderCards = (cards: string[], hideFirst: boolean = false) =>
    cards.length === 0? (
      <div className="flex">
        <img
          src={getCardImage("BACK")}
          alt="empty-card"
          className="w-[80px] h-auto mx-1 drop-shadow-md"
        />
        <img
          src={getCardImage("BACK")}
          alt="empty-card"
          className="w-[80px] h-auto mx-1 drop-shadow-md"
        />
      </div>
    ) : 
    cards.map((card, index) => (
      <img
        key={index}
        src={hideFirst && index === 0 ? getCardImage("BACK") : getCardImage(card)}
        alt={`card-${index}`}
        className="w-[80px] h-auto mx-1 drop-shadow-md"
      />
  ));
  const gameSet = (dealerGet:number[], playerGet:number[]) => {
    setDealerRawCards(dealerGet.map((d: number) => d));
    setPlayerRawCards(playerGet.map((p: number) => p));
    setDealerCards(dealerGet.map((d: number) => transformCard(d)));
    setPlayerCards(playerGet.map((p: number) => transformCard(p)));
    setDealerScore(calculateHandValue(dealerGet.map((d: number) => Number(d))).toString());
    setPlayerScore(calculateHandValue(playerGet.map((p: number) => Number(p))).toString());
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target.value as unknown) as number;
    if (!isNaN(value)) {
      setBetAmount(value);
    }
  };

  // nonContract area
 const generateCards = async() => {
    const newDeck = createShuffledDeck();
    const dealer = [newDeck[0], newDeck[1]];
    const player = [newDeck[2], newDeck[3]];
    gameSet(dealer, player);
    gameSet(dealer, player);
    const remainingDeck = newDeck.slice(4);
    setDeck(remainingDeck);
}


  // contract area
  const fetchCards= async() => {
    try {
      const contract = await getContract();
      await contract.newGame();
      const [dealerGet, playerGet] = await contract.getFirst4Cards();
      const dealer = dealerGet.map((card: bigint) => Number(card));
      const player = playerGet.map((card: bigint) => Number(card));
      gameSet(dealer, player);
    } catch (err) {
      console.error("取得卡牌失敗：", err);
    }
  }
//   const fetchCards = async () => {
// // 1. 呼叫智能合約的 newGame，傳入下注金額（wei）
// const tx = await contract.newGame({ value: utils.parseEther("0.01") });

// // 2. 等待交易完成
// const receipt = await tx.wait();

// // 3. 從事件中取得 gameId 和其他資訊
// const event = receipt.events?.find(e => e.event === "GameCreated");

// if (event) {
//   const gameId = event.args?.gameId;

//   // 4. 呼叫合約的 view function 取得完整遊戲資料
//   const gameInfo = await contract.getGameInfo(gameId);

//   console.log("遊戲資訊：", {
//     gameId,
//     player: gameInfo.player,
//     bet: ethers.utils.formatEther(gameInfo.bet),
//     deckHash: gameInfo.deckHash,
//     isActive: gameInfo.isActive
//   });

//   // 5. 儲存到前端狀態或跳轉到下一步遊戲邏輯
// }
// }

  const playerHit = () => {
    const nextCard = deck[0];
    const newDeck = deck.slice(1);             // 移除這張牌
    const newPlayerCards = [...playerRawCards, nextCard]; // 加入玩家手牌
    setDeck(newDeck);                          // 更新牌堆
    setPlayerRawCards(newPlayerCards);         // 更新玩家手牌
    setPlayerCards(newPlayerCards.map((p: number) => transformCard(Number(p)))); // 更新顯示的手牌
    setPlayerScore(calculateHandValue(newPlayerCards.map((p: number) => Number(p))).toString()); // 更新玩家分數
    if(scoreCount(calculateHandValue(newPlayerCards.map((p: number) => Number(p)))) > 21) {
      setTimeout(() => {
        setModalMessage("You Bust! 😢");
        setIsModalOpen(true);
      }, 1000); // 延遲 1 秒（1000 毫秒
    }
  }
  const playerStand = () => {
    setIsPlayerOver(true);
    setIsDealerDrawing(true); // 開始莊家摸牌
  
    setTimeout(() => {
      let dealerCards = [...dealerRawCards];
      let currentDeck = [...deck];
  
      const drawCard = () => {
        const dealerScore = calculateHandValue(dealerCards);
  
        if (scoreCount(dealerScore) >= 17) {
          setDealerRawCards(dealerCards);
          setDealerCards(dealerCards.map((d: number) => transformCard(Number(d))));
          setDealerScore(dealerScore.toString());
          setIsDealerDrawing(false); 
  
          setTimeout(() => {
            const playerScoreNum = scoreCount(playerScore);
            const dealerScoreNum = scoreCount(dealerScore);
            if (playerScoreNum > dealerScoreNum || dealerScoreNum > 21) {
              setModalMessage('You Win! 🎉');
              setIsModalOpen(true);
              setPlayerBetAmount(playerBetAmount + realBetAmount * 2); // 玩家贏了，獲得兩倍的下注金額
            } else if (playerScoreNum < dealerScoreNum) {
              setModalMessage("You Lose! 😢");
              setIsModalOpen(true);
            } else {
              setModalMessage("It's a Tie! 🤝");
              setIsModalOpen(true);
              setPlayerBetAmount(playerBetAmount + realBetAmount); // 平手，退回下注金額
            }
          }, 800);
          setIsGameOver(true); // 遊戲結束
      
          return;
        }
  
        const nextCard = currentDeck.shift();
        if (nextCard !== undefined) {
          dealerCards.push(nextCard);
          setDealerRawCards([...dealerCards]);
          setDealerCards(dealerCards.map((d: number) => transformCard(Number(d))));
          setDeck([...currentDeck]);
        }
  
        setTimeout(drawCard, 800);
      };
  
      drawCard();
    }, 1000);
  };

  const handleBet = async() => {
    if (betAmount < 0 || betAmount > playerBetAmount) {
     return  alert("請輸入有效的下注金額！");
    }
    setIsGameStarted(true); // 開始遊戲
    setPlayerBetAmount(playerBetAmount - betAmount); // 扣除玩家的下注金額
    setRealBetAmount(Number(betAmount)); // 更新實際下注金額
    if(withContract){
      fetchCards();
    } else {
      generateCards();
    }

    setBetAmount(0); // 清空輸入框
  };

  const resetGame = () => {
    setDeck([]);
    setDealerRawCards([]);
    setPlayerRawCards([]);
    setDealerCards([]);
    setPlayerCards([]);
    setDealerScore("");
    setPlayerScore("");
    setIsPlayerOver(false);
    setIsDealerDrawing(false);
    setIsGameStarted(false);  // 🔁 關鍵：回到下注狀態
    setIsGameOver(false);
    setModalMessage("");
    setRealBetAmount(0);
    setIsModalOpen(false);
  };
  

 // Popup modal controller
  const handleConnectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("連接錢包成功", accounts);
        if (accounts && accounts.length > 0) {
          setWithContract(true);
          console.log("連接錢包成功", accounts[0]);
        }
      } else {
        alert("請安裝 MetaMask 擴充功能！");
      }
    } catch (err) {
      console.error("連接錢包失敗", err);
    } finally {
      setShowConnectModal(false);
    }
  }; 
  const handleCancelConnect = () => {
    setShowConnectModal(false);
    setPlayerBetAmount(2000);
  };

  const actionButtons = [
    { label: "Hit", show: gameState.canHit, onclick: playerHit },
    { label: "Stand", show: gameState.canStand , onclick: playerStand },
    { label: "Double", show: gameState.canDouble },
    { label: "Split", show: gameState.canSplit },
    { label: "Surrender", show: gameState.canSurrender },
    { label: "Insurance", show: gameState.canInsurance },
  ];

  const displayedDealerScore = isPlayerOver 
    ? calculateHandValue(dealerRawCards) 
      : calculateHandValue(dealerRawCards.slice(1));


  return (
    <div className="w-full min-h-screen pt-[90px] bg-gradient-to-b from-green-900 to-green-600 flex flex-col items-center justify-center">
      <div className="min-h-[80vh] flex flex-col items-center justify-between py-10 px-4 text-white font-semibold">
        {/* Dealer */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-2">Dealer</h2>
          <div className="flex">{ 
            renderCards(dealerCards , !isPlayerOver) // hide first card
          }</div>
          <h2 className="mt-1">Dealer Score:{ displayedDealerScore }</h2>

        </div>

        {/* Player */}
        <div className="flex flex-col items-center my-6 relative">
          <p className="text-white mb-2 text-lg">
            Your Current Bet Amount: {playerBetAmount} ETH
          </p>
          {
            !isGameStarted ? (
              <div className="flex flex-col items-center my-6">
                <label className="text-white mb-2 text-lg">Place Your Bet</label>
                  <input
                    value={betAmount}
                    onChange={handleInputChange}
                    className="px-4 py-2 rounded-lg border-2 border-[#1a1a1a] focus:outline-none w-60 text-white"
                    placeholder="例如：0.01 ETH"
                  />
                  <button
                    onClick={handleBet}
                    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md"
                  >
                    Bet
                  </button>
              </div>
            ) : (
              <div className=" mt-1 text-lg">
                {isGameOver ? 
                (<p className="text-fuchsia-500 text-lg animate-pulse mt-4">
                  Game Over...
                </p>):
                isDealerDrawing ? (
                  <p className="text-yellow-500 text-lg animate-pulse mt-4">
                    Dealer Turn...
                  </p>
                ):(
                  <p className="text-red-500 text-lg animate-pulse mt-4">
                    Player Turn...
                  </p>
                )}
                <p className="text-white my-4 text-lg">
                   Your Bet In This Turn: {realBetAmount} ETH 
                </p>
              </div>
            )
          }
          
          
        </div>

        
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-2">You</h2>
          <div className="flex">{renderCards(playerCards)}</div>
          <h2 className="mt-1">Your Score:{ playerScore }</h2>
          <div className="flex gap-2 mt-4">

            {actionButtons.map((button) => (
              button.show && (
                <button key={button.label} className="" onClick={button.onclick}>
                  {button.label}
                </button>
              )
            ))}
          </div>
        </div>
        {showConnectModal && (
          <ConnectModal onConnect={()=> handleConnectWallet() } onClose={()=> handleCancelConnect() } />
        )}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg w-[300px]">
              <h2 className="text-xl text-black font-bold mb-4">{modalMessage}</h2>
              <button
                onClick={() => resetGame()}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default BlackjackTable;