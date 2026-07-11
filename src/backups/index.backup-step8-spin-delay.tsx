import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Screen = "welcome" | "lobby" | "neonDragon";

const STARTING_COINS = 10000;
const DEFAULT_BET = 100;
const BET_OPTIONS = [100, 250, 500];

const NEON_DRAGON_SYMBOLS = ["🐉", "🪙", "💎", "🔥", "🥚", "🏮", "7️⃣", "🟩"];

function getRandomSymbol() {
  const randomIndex = Math.floor(Math.random() * NEON_DRAGON_SYMBOLS.length);
  return NEON_DRAGON_SYMBOLS[randomIndex];
}

function createRandomReels() {
  const newReels = [];

  for (let reelIndex = 0; reelIndex < 5; reelIndex++) {
    const reel = [];

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      reel.push(getRandomSymbol());
    }

    newReels.push(reel);
  }

  return newReels;
}

function calculateMiddleRowWin(newReels: string[][], betAmount: number) {
  const middleRowSymbols = newReels.map((reel) => reel[1]);

  const symbolCounts: Record<string, number> = {};

  middleRowSymbols.forEach((symbol) => {
    symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
  });

  const highestMatchCount = Math.max(...Object.values(symbolCounts));

  if (highestMatchCount >= 5) {
    return betAmount * 50;
  }

  if (highestMatchCount === 4) {
    return betAmount * 15;
  }

  if (highestMatchCount === 3) {
    return betAmount * 5;
  }

  return 0;
}

export default function HomeScreen() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [coins, setCoins] = useState(STARTING_COINS);

  if (screen === "lobby") {
    return (
      <LobbyScreen
        coins={coins}
        onBack={() => setScreen("welcome")}
        onOpenNeonDragon={() => setScreen("neonDragon")}
      />
    );
  }

  if (screen === "neonDragon") {
    return (
      <NeonDragonScreen
        coins={coins}
        setCoins={setCoins}
        onBack={() => setScreen("lobby")}
      />
    );
  }

  return <WelcomeScreen onEnter={() => setScreen("lobby")} />;
}

function WelcomeScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>🎰</Text>

        <Text style={styles.title}>Lucky Quest Slots</Text>

        <Text style={styles.subtitle}>
          A free social slots adventure for entertainment only.
        </Text>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>18+ Entertainment Only</Text>
          <Text style={styles.noticeText}>
            No real-money gambling. No cash prizes. No cashout. Coins and
            rewards are virtual and cannot be redeemed.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onEnter}>
          <Text style={styles.buttonText}>Enter Lobby</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function LobbyScreen({
  coins,
  onBack,
  onOpenNeonDragon,
}: {
  coins: number;
  onBack: () => void;
  onOpenNeonDragon: () => void;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lobbyHeader}>
        <Text style={styles.smallLogo}>🎰 Lucky Quest Slots</Text>
        <Text style={styles.coinBalance}>🪙 {coins.toLocaleString()} Coins</Text>
      </View>

      <View style={styles.lobbyCard}>
        <Text style={styles.sectionTitle}>Choose Your Quest</Text>
        <Text style={styles.sectionSubtitle}>
          Start with one free slot machine. More free slots are coming next.
        </Text>

        <SlotCard
          icon="🐉"
          title="Neon Dragon Fortune"
          description="Vegas neon, glowing gems, and dragon treasure."
          status="Playable"
          onPress={onOpenNeonDragon}
        />

        <SlotCard
          icon="🏴‍☠️"
          title="Pirate Moon Jackpot"
          description="Treasure maps, moonlit reels, and pirate rewards."
          status="Coming Soon"
        />

        <SlotCard
          icon="🐱"
          title="Catsino Royale"
          description="Luxury casino cats, golden paws, and royal rewards."
          status="Coming Soon"
        />

        <View style={styles.row}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Objectives</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Rewards</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function SlotCard({
  icon,
  title,
  description,
  status,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  status: string;
  onPress?: () => void;
}) {
  const isPlayable = status === "Playable";

  return (
    <TouchableOpacity
      style={[
        styles.slotCard,
        isPlayable ? styles.playableSlot : styles.lockedSlot,
      ]}
      onPress={isPlayable ? onPress : undefined}
      activeOpacity={isPlayable ? 0.7 : 1}
    >
      <Text style={styles.slotIcon}>{icon}</Text>

      <View style={styles.slotTextBox}>
        <Text style={styles.slotTitle}>{title}</Text>
        <Text style={styles.slotDescription}>{description}</Text>
      </View>

      <Text style={isPlayable ? styles.playableStatus : styles.lockedStatus}>
        {status}
      </Text>
    </TouchableOpacity>
  );
}

function NeonDragonScreen({
  coins,
  setCoins,
  onBack,
}: {
  coins: number;
  setCoins: (coins: number) => void;
  onBack: () => void;
}) {
  const [reels, setReels] = useState<string[][]>(createRandomReels());
  const [resultMessage, setResultMessage] = useState("Ready to spin.");
  const [lastWin, setLastWin] = useState(0);
  const [betAmount, setBetAmount] = useState(DEFAULT_BET);
  const [isSpinning, setIsSpinning] = useState(false);

  function decreaseBet() {
    if (isSpinning) {
      return;
    }

    const currentIndex = BET_OPTIONS.indexOf(betAmount);

    if (currentIndex > 0) {
      setBetAmount(BET_OPTIONS[currentIndex - 1]);
      setResultMessage(`Bet changed to ${BET_OPTIONS[currentIndex - 1]} coins.`);
      setLastWin(0);
    }
  }

    function increaseBet() {
      if (isSpinning) {
        return;
      }

      const currentIndex = BET_OPTIONS.indexOf(betAmount);

      if (currentIndex < BET_OPTIONS.length - 1) {
        setBetAmount(BET_OPTIONS[currentIndex + 1]);
        setResultMessage(`Bet changed to ${BET_OPTIONS[currentIndex + 1]} coins.`);
        setLastWin(0);
      }
    }

  function handleSpin() {
    if (isSpinning) {
      return;
    }

    if (coins < betAmount) {
      setResultMessage("Not enough coins for this bet. Lower your bet or claim a reward.");
      setLastWin(0);
      return;
    }

    setIsSpinning(true);
    setLastWin(0);
    setResultMessage("The dragon reels are spinning...");

    setTimeout(() => {
      const newReels = createRandomReels();
      const winAmount = calculateMiddleRowWin(newReels, betAmount);
      const newCoinBalance = coins - betAmount + winAmount;

      setReels(newReels);
      setCoins(newCoinBalance);
      setLastWin(winAmount);

      if (winAmount > 0) {
        setResultMessage(`Dragon fortune! You won ${winAmount.toLocaleString()} coins.`);
      } else {
        setResultMessage("No win this spin. Try again.");
      }

      setIsSpinning(false);
    }, 700);
  }

  return (
    <SafeAreaView style={styles.slotContainer}>
      <View style={styles.slotHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerLink}>← Lobby</Text>
        </TouchableOpacity>

        <Text style={styles.headerCoins}>🪙 {coins.toLocaleString()}</Text>
      </View>

      <Text style={styles.machineTitle}>🐉 Neon Dragon Fortune</Text>

      <Text style={styles.machineSubtitle}>
        Vegas neon meets dragon treasure.
      </Text>

      <View style={styles.reelBoard}>
        {reels.map((reel, reelIndex) => (
          <View key={reelIndex} style={styles.reel}>
            {reel.map((symbol, symbolIndex) => (
              <View key={symbolIndex} style={styles.symbolBox}>
                <Text style={styles.symbol}>{symbol}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.betBox}>
        <Text style={styles.betText}>Bet: {betAmount.toLocaleString()} coins</Text>

        <View style={styles.betControls}>
          <TouchableOpacity
            style={[styles.betButton, isSpinning && styles.disabledButton]}
            onPress={decreaseBet}
            disabled={isSpinning}
          >
            <Text style={styles.betButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.betChoice}>{betAmount.toLocaleString()}</Text>

          <TouchableOpacity
            style={[styles.betButton, isSpinning && styles.disabledButton]}
            onPress={increaseBet}
            disabled={isSpinning}
          >
            <Text style={styles.betButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {lastWin > 0 && (
          <Text style={styles.winText}>
            Last win: {lastWin.toLocaleString()} coins
          </Text>
        )}

        <Text style={styles.resultText}>{resultMessage}</Text>
      </View>

      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.disabledSpinButton]}
        onPress={handleSpin}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>
          {isSpinning ? "SPINNING..." : "SPIN"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.safeText}>
        Virtual coins only. No cashout. Entertainment only.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080816",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#14142b",
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: "#f5c542",
    alignItems: "center",
  },
  logo: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#f5c542",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#d7d7ff",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  noticeBox: {
    width: "100%",
    backgroundColor: "#202044",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  noticeText: {
    fontSize: 14,
    color: "#c9c9e8",
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#8a2be2",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  lobbyHeader: {
    width: "100%",
    maxWidth: 460,
    marginBottom: 16,
  },
  smallLogo: {
    color: "#f5c542",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  coinBalance: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  lobbyCard: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#14142b",
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: "#f5c542",
  },
  sectionTitle: {
    color: "#f5c542",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: "#d7d7ff",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 18,
  },
  slotCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  playableSlot: {
    backgroundColor: "#22224a",
    borderColor: "#9d4edd",
  },
  lockedSlot: {
    backgroundColor: "#1b1b33",
    borderColor: "#444466",
    opacity: 0.8,
  },
  slotIcon: {
    fontSize: 34,
    marginRight: 12,
  },
  slotTextBox: {
    flex: 1,
  },
  slotTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  slotDescription: {
    color: "#c9c9e8",
    fontSize: 13,
    lineHeight: 18,
  },
  playableStatus: {
    color: "#7CFF9B",
    fontSize: 12,
    fontWeight: "800",
  },
  lockedStatus: {
    color: "#bbbbcc",
    fontSize: 12,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#202044",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444466",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  backButton: {
    marginTop: 16,
    alignItems: "center",
  },
  backButtonText: {
    color: "#d7d7ff",
    fontSize: 14,
    fontWeight: "700",
  },
  slotContainer: {
    flex: 1,
    backgroundColor: "#080816",
    padding: 20,
    alignItems: "center",
  },
  slotHeader: {
    width: "100%",
    maxWidth: 500,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  headerLink: {
    color: "#d7d7ff",
    fontSize: 16,
    fontWeight: "800",
  },
  headerCoins: {
    color: "#f5c542",
    fontSize: 18,
    fontWeight: "800",
  },
  machineTitle: {
    color: "#f5c542",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  machineSubtitle: {
    color: "#d7d7ff",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
  },
  reelBoard: {
    width: "100%",
    maxWidth: 500,
    flexDirection: "row",
    backgroundColor: "#14142b",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#f5c542",
    padding: 10,
    marginBottom: 20,
  },
  reel: {
    flex: 1,
    gap: 8,
  },
  symbolBox: {
    backgroundColor: "#22224a",
    borderRadius: 14,
    marginHorizontal: 4,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#9d4edd",
  },
  symbol: {
    fontSize: 34,
  },
  betBox: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#14142b",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#444466",
  },
  betText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  betControls: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  marginBottom: 10,
},
betButton: {
  width: 42,
  height: 42,
  borderRadius: 12,
  backgroundColor: "#8a2be2",
  alignItems: "center",
  justifyContent: "center",
},
disabledButton: {
  opacity: 0.45,
},
betButtonText: {
  color: "#ffffff",
  fontSize: 26,
  fontWeight: "900",
},
betChoice: {
  color: "#f5c542",
  fontSize: 20,
  fontWeight: "900",
  minWidth: 80,
  textAlign: "center",
},
  winText: {
    color: "#7CFF9B",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  resultText: {
    color: "#c9c9e8",
    fontSize: 15,
    textAlign: "center",
  },
  spinButton: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#8a2be2",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
  },
  disabledSpinButton: {
    opacity: 0.65,
  },
  spinButtonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
  },
  safeText: {
    color: "#8888aa",
    fontSize: 12,
    textAlign: "center",
  },
});