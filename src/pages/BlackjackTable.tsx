import { useEffect, useState } from "react";
import getCardImage from "../utils/getCardImage"; 
import { createShuffledDeck } from "../utils/createShuffledDeck"; 
import { scoreCount } from "../utils/scoreCount";
import { getContract } from "../hooks/useCallContract"; 
import { useGameState } from "../hooks/useGameState";
import ConnectModal from "../components/ConnectModal";
import { ethers } from "ethers";
import { EventLog } from "ethers";
import { keccak256, encodePacked } from 'viem';
type GameStatus = "waiting" | "betting" | "player" | "dealer" | "over";


const BlackjackTable = () => {
  // demo modal controller
  const [showConnectModal, setShowConnectModal] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [withContract, setWithContract] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("betting");

  const [deck, setDeck] = useState<number[]>([]);
  const [deckSeed, setDeckSeed] = useState<string>(""); // 牌組的 seed
  const [gameId , setGameId] = useState<string>(""); // 遊戲 ID
  const [revealedCards , setRevealedCards] = useState<number[]>([]);
  const [playerCardCount  , setPlayerCardCount ] = useState<number>(0);


  const [playerBetAmount, setPlayerBetAmount] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<number>(0); 
  const [realBetAmount, setRealBetAmount] = useState<number>(0); 
  

  // data controller
  const [dealerRawCards, setDealerRawCards] = useState<number[]>([]);
  const [playerRawCards, setPlayerRawCards] = useState<number[]>([]); 

  const [dealerScore, setDealerScore] = useState<string>("");
  const [playerScore, setPlayerScore] = useState<string>("");

  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [playerCards, setPlayerCards] = useState<string[]>([]);

  
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isPlayerOver, setIsPlayerOver] = useState<boolean>(false); 



  const gameState = useGameState(playerRawCards, dealerRawCards, isGameStarted, isPlayerOver);


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
    const cardValue = (cardIndex % 13) + 1;
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
    console.log(dealerScore);
    setPlayerScore(calculateHandValue(playerGet.map((p: number) => Number(p))).toString());
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target.value as unknown) as number;
    if (!isNaN(value)) {
      setBetAmount(value);
    }
  };

  // nonContract area
 const generateCards = async(cardArr:number[]) => {
    const newDeck = cardArr;
    const dealer = [newDeck[0], newDeck[1]];
    const player = [newDeck[2], newDeck[3]];
    gameSet(dealer, player);
    const remainingDeck = newDeck.slice(4);
    setRevealedCards([dealer[0], dealer[1], player[0], player[1]]);
    setPlayerCardCount(2);
    setDeck(remainingDeck);
}


  // contract area

  const solidityShuffle = (seedHex: string): number[] =>{
    const deck: number[] = Array.from({ length: 52 }, (_, i) => i);
    let seed = BigInt(seedHex);
    for (let i = 51; i > 0; i--) {
      const packed = encodePacked(['uint256', 'uint256'], [seed, BigInt(i)]);
      const hash = keccak256(packed);
      seed = BigInt(hash);
  
      const j = Number(seed % BigInt(i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }  
    return deck;
  }
  const fetchCards = async () => {
    try {
      const contract = await getContract();
      const seed = ethers.randomBytes(32);
      const seedHex = ethers.hexlify(seed);
      // console.log("Seed:", seedHex);
      const deckHash = ethers.keccak256(seed);
      setDeckSeed(seedHex);      
      // console.log("Deck Hash:", deckHash);
      const tx = await contract.newGame(deckHash,{
        value: ethers.parseEther(betAmount.toString()), // 下注金額
      });
  
      const receipt = await tx.wait();
      // console.log("✅ Transaction Mined", receipt);
  
      // 使用 contract.queryFilter 直接抓事件
      const logs = await contract.queryFilter(
        contract.filters.GameCreated(),
        receipt.blockNumber,
        receipt.blockNumber
      );
      
  
      if (logs.length > 0) {
        const event = logs[0] as EventLog;
        const gameId = event.args.gameId;
  
        await contract.getGameInfo(gameId);
        // console.log("🎮 Game Info:", {
        //   player: gameInfo.player,
        //   bet: gameInfo.bet.toString(),
        //   deckSeed: gameInfo.deckSeed,
        //   isActive: gameInfo.isActive,
        //   gameId: gameId.toString(),
        // });

        setGameId(gameId.toString());
        const fullDeck = solidityShuffle(seedHex);
        generateCards(fullDeck);
      } else {
        console.warn("⚠️ Missing GameCreated Event (queryFilter)");
      }
    } catch (error) {
      console.error("❌ Error Code:", error);
    }
  };

  const gameOverToContract = async (finalRevealedCards: number[], playerCardCount:number) => {
    setIsWaiting(true);
    try {
      const contract = await getContract();
      // console.log("📤 Sending game result:", {
      //   gameId,
      //   deckSeed,
      //   revealedCards:finalRevealedCards,
      //   playerCardCount: playerCardCount,
      // });
      const tx = await contract.endGame(
        gameId,
        deckSeed,         
        finalRevealedCards,           
        playerCardCount          
      );
  
      const receipt = await tx.wait();
      receipt.events?.forEach((event: any) => {
        console.log("Event:", event.event, event.args);
      });
  
      // console.log("📨 endGame tx confirmed:", receipt.transactionHash);
  
      // 可選：讀取 GameEnded 事件確認
      const events = await contract.queryFilter(
        contract.filters.GameEnded(),
        receipt.blockNumber,
        receipt.blockNumber
      );
      
  
      if (events.length > 0) {
        const event = events[0] as EventLog;
        console.log("✅ GameEnded Event:", event.args);
      } else {
        console.warn("⚠️ GameEnded event not found in block.");
      }
  
    } catch (error) {
      console.error("❌ handleGameOver error:", error);
      setModalMessage("Failed to submit game result to contract ❌");
      setIsModalOpen(true);
    }
  };


  // player action
  const playerHit = () => {
    const nextCard = deck[0];
    
    const updatedRevealedCards = [...revealedCards, nextCard];
    setRevealedCards(updatedRevealedCards);

    const newPlayerCards = [...playerRawCards, nextCard];
    setPlayerRawCards(newPlayerCards);

    const newPlyerCount = playerCardCount + 1;
    setPlayerCardCount(newPlyerCount);
    setPlayerCards(newPlayerCards.map((p: number) => transformCard(Number(p))));

    const playerScore = calculateHandValue(newPlayerCards.map((p: number) => Number(p))).toString();
    setPlayerScore(playerScore);
    const newDeck = deck.slice(1);
    setDeck(newDeck);
    
    if(scoreCount(calculateHandValue(newPlayerCards.map((p: number) => Number(p)))) > 21) {
      setGameStatus("over");
      setTimeout(() => {
        if (withContract) {
          gameOverToContract(updatedRevealedCards,newPlyerCount); // 提交遊戲結果到合約
        }
        setGameStatus("over");
        setModalMessage("You Bust! 😢");
        setIsModalOpen(true);
      }, 1000); // 延遲 1 秒（1000 毫秒
    }
  }
  const playerStand = () => {
    setIsPlayerOver(true);
    setGameStatus("dealer");
  
    let dealerCards = [...dealerRawCards];
    let currentDeck = [...deck];
  
    let updatedRevealedCards = [...revealedCards];
  
    const drawCard = () => {
      const dealerScore = calculateHandValue(dealerCards);
  
      if (scoreCount(dealerScore) >= 17) {
        setDealerRawCards(dealerCards);
        setDealerCards(dealerCards.map((d: number) => transformCard(Number(d))));
        setDealerScore(dealerScore.toString());
        setGameStatus("over");
        setTimeout(async() => {
          const playerScoreNum = scoreCount(playerScore);
          const dealerScoreNum = scoreCount(dealerScore);
          setGameStatus("over");
          if (playerScoreNum > dealerScoreNum || dealerScoreNum > 21) {
            setModalMessage('You Win! 🎉');
            setPlayerBetAmount(playerBetAmount + realBetAmount * 2);
          } else if (playerScoreNum < dealerScoreNum) {
            setModalMessage("You Lose! 😢");
          } else {
            setModalMessage("It's a Tie! 🤝");
            setPlayerBetAmount(playerBetAmount + realBetAmount);
          }
  
          setIsModalOpen(true);
  
          if (withContract) {
            await gameOverToContract(updatedRevealedCards, playerCardCount);
            setIsWaiting(false);
          }
        }, 1200);
        return;
      }
  
      const nextCard = currentDeck.shift();
      if (nextCard !== undefined) {
        dealerCards.push(nextCard);
        updatedRevealedCards.push(nextCard);
  
        setDealerRawCards([...dealerCards]);
        setDealerCards(dealerCards.map((d: number) => transformCard(Number(d))));
        setDeck([...currentDeck]);
        setRevealedCards([...updatedRevealedCards]);
      }
  
      setTimeout(drawCard, 800);
    };
  
    setTimeout(drawCard, 1000);
  };

  const handleBet = async() => {
    if (betAmount <= 0 || betAmount > playerBetAmount) {
     return  alert("Please enter a valid bet amount!");
    }
    setPlayerBetAmount(playerBetAmount - betAmount);
    setRealBetAmount(Number(betAmount));
    if(withContract){
      setGameStatus("waiting");
      await fetchCards();
    } else {
      generateCards(createShuffledDeck());
    }
    setGameStatus("player");
    setIsGameStarted(true);
    setBetAmount(0);
  };

  const resetGame = () => {
    if (withContract) {

    }
    setDeckSeed("");
    setGameId("");
    setRevealedCards([]);
    setPlayerCardCount(0);
    setDeck([]);
    setDealerRawCards([]);
    setPlayerRawCards([]);
    setDealerCards([]);
    setPlayerCards([]);
    setDealerScore("");
    setPlayerScore("");
    setIsPlayerOver(false);
    setIsGameStarted(false);
    setGameStatus("betting");
    setModalMessage("");
    setRealBetAmount(0);
    setIsModalOpen(false);
  };
  

 // Popup modal controller
  const handleConnectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setWithContract(true);
          const provider = new ethers.BrowserProvider(window.ethereum); // 建立 provider
          const balance = await provider.getBalance(accounts[0]); // 取得 ETH 餘額（單位：wei）
          const ethBalance = ethers.formatEther(balance); // 轉換成 ETH 格式
          setPlayerBetAmount((Number(ethBalance)));
  
        }
      } else {
        alert("Please install MetaMask!");
      }
    } catch (err) {
      console.error("MetaMask Error", err);
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
  const displayedPlayerScore = calculateHandValue(playerRawCards)
    ? calculateHandValue(playerRawCards)
     : calculateHandValue(playerRawCards).toString();


  return (
    <div className="w-full min-h-screen pt-[50px] bg-gradient-to-b from-green-900 to-green-600 flex flex-col items-center justify-center">
      <div className="min-h-[80vh] flex flex-col items-center py-10 px-4 text-white font-semibold">
        {/* Dealer */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-2">Dealer</h2>
          <div className="flex">{ 
            renderCards(dealerCards , !isPlayerOver) // hide first card
          }</div>
          <h2 className="mt-1">Dealer Score: { displayedDealerScore }</h2>

        </div>

        {/* Player */}
        <div className="flex flex-col items-center my-3 relative">
          <p className="text-white mb-2 text-lg">
            Your Current Bet Amount: {playerBetAmount} ETH
          </p>
          {/* {isWaiting && (
            <p className="text-yellow-500 text-lg animate-pulse mt-4">
              Waiting for cards to be shuffled...
            </p>
          )} */}
          {
            <div className="text-lg">
              {gameStatus === "over" && <p className="text-yellow-500 animate-pulse py-4">Game Over...</p>}
              {gameStatus === "dealer" && <p className="text-fuchsia-500 animate-pulse py-4">Dealer Drawing Cards...</p>}
              {gameStatus === "player" && <p className="text-red-500 animate-pulse py-4">Player turn...</p>}
              {gameStatus === "waiting" && <p className="text-yellow-500 animate-pulse py-4">Waiting for transaction confirmation...</p>}
              {gameStatus !== "betting" && <p className="text-white"> Your Bet Amount: {realBetAmount} ETH</p>}
              {gameStatus === 'betting' && (
                <div className="flex flex-col items-center">
                  <label className="text-white mb-2 text-lg">Place Your Bet</label>
                    <input
                      value={betAmount}
                      onChange={handleInputChange}
                      className="px-4 py-2 rounded-lg border-2 border-[#1a1a1a] focus:outline-none w-60 text-white"
                      placeholder="Enter bet amount"
                    />
                    <button
                      onClick={handleBet}
                      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md"
                    >
                      Bet
                    </button>
                </div>
              )}
            </div>
          }          
        </div>

        
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-2">You</h2>
          <div className="flex">{renderCards(playerCards)}</div>
          <h2 className="mt-1">Your Score: { displayedPlayerScore }</h2>
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
                {
                  !isWaiting? (
                    <button
                      onClick={() => resetGame()}
                      className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                      Confirm
                    </button>
                  ): (
                    <p className="text-yellow-500 text-lg animate-pulse mt-4">

                      Waiting for transaction confirmation...
                    </p>
                  )
                } 
              </div>
            </div>
          )}
      </div>
    </div>

  );
};

export default BlackjackTable;