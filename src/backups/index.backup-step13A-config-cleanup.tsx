// @ts-nocheck
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    AD_COOLDOWN_MS,
    BET_OPTIONS,
    DAILY_BONUS,
    DAILY_COOLDOWN_MS,
    DEFAULT_BET,
    HOURLY_BONUS,
    HOURLY_COOLDOWN_MS,
    NEON_DRAGON_OBJECTIVE_REWARD,
    NEON_DRAGON_SYMBOLS,
    REWARD_CLAIM_OBJECTIVE_REWARD,
    REWARDED_AD_BONUS,
    SPIN_OBJECTIVE_REWARD,
    STARTING_COINS,
    STORAGE_KEY,
    WIN_OBJECTIVE_REWARD,
} from "../constants/gameConfig";

type Screen = "welcome" | "lobby" | "neonDragon" | "rewards" | "objectives";

type GameSaveData = {
  coins: number;
  lastDailyClaim: number | null;
  lastHourlyClaim: number | null;
  lastAdClaim: number | null;
  spinCount: number;
  winCount: number;
  rewardClaimCount: number;
  neonDragonVisitCount: number;
  claimedObjectives: string[];
};

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

function formatTimeRemaining(milliseconds: number) {
  if (milliseconds <= 0) {
    return "Ready";
  }

  const totalSeconds = Math.ceil(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

export default function HomeScreen() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [coins, setCoins] = useState(STARTING_COINS);

  const [lastDailyClaim, setLastDailyClaim] = useState<number | null>(null);
  const [lastHourlyClaim, setLastHourlyClaim] = useState<number | null>(null);
  const [lastAdClaim, setLastAdClaim] = useState<number | null>(null);

  const [spinCount, setSpinCount] = useState(0);
  const [winCount, setWinCount] = useState(0);
  const [rewardClaimCount, setRewardClaimCount] = useState(0);
  const [neonDragonVisitCount, setNeonDragonVisitCount] = useState(0);

  const [claimedObjectives, setClaimedObjectives] = useState<string[]>([]);

  const [isSaveLoaded, setIsSaveLoaded] = useState(false);

  useEffect(() => {
    async function loadGameSave() {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedData !== null) {
          const parsedSave: GameSaveData = JSON.parse(savedData);

          setCoins(parsedSave.coins ?? STARTING_COINS);
          setLastDailyClaim(parsedSave.lastDailyClaim ?? null);
          setLastHourlyClaim(parsedSave.lastHourlyClaim ?? null);
          setLastAdClaim(parsedSave.lastAdClaim ?? null);
          setSpinCount(parsedSave.spinCount ?? 0);
          setWinCount(parsedSave.winCount ?? 0);
          setRewardClaimCount(parsedSave.rewardClaimCount ?? 0);
          setNeonDragonVisitCount(parsedSave.neonDragonVisitCount ?? 0);
          setClaimedObjectives(parsedSave.claimedObjectives ?? []);
        }
      } catch (error) {
        console.log("Failed to load save data:", error);
      } finally {
        setIsSaveLoaded(true);
      }
    }

    loadGameSave();
  }, []);

  useEffect(() => {
    if (!isSaveLoaded) {
      return;
    }

    async function saveGameData() {
      const saveData: GameSaveData = {
        coins,
        lastDailyClaim,
        lastHourlyClaim,
        lastAdClaim,
        spinCount,
        winCount,
        rewardClaimCount,
        neonDragonVisitCount,
        claimedObjectives,
      };

      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      } catch (error) {
        console.log("Failed to save game data:", error);
      }
    }

  saveGameData();
},[
  coins,
  lastDailyClaim,
  lastHourlyClaim,
  lastAdClaim,
  spinCount,
  winCount,
  rewardClaimCount,
  neonDragonVisitCount,
  claimedObjectives,
  isSaveLoaded,
]);

  if (!isSaveLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.logo}>ðŸŽ°</Text>
          <Text style={styles.title}>Lucky Quest Slots</Text>
          <Text style={styles.subtitle}>Loading your quest...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "lobby") {
    return (
      <LobbyScreen
        coins={coins}
        onBack={() => setScreen("welcome")}
        onOpenNeonDragon={() => {
          setNeonDragonVisitCount((currentCount) => currentCount + 1);
          setScreen("neonDragon");
        }}
        onOpenRewards={() => setScreen("rewards")}
        onOpenObjectives={() => setScreen("objectives")}
      />
    );
  }

  if (screen === "neonDragon") {
    return (
      <NeonDragonScreen
        coins={coins}
        setCoins={setCoins}
        onSpin={() => setSpinCount((currentCount) => currentCount + 1)}
        onWin={() => setWinCount((currentCount) => currentCount + 1)}
        onBack={() => setScreen("lobby")}
      />
    );
  }

  if (screen === "rewards") {
    return (
      <RewardsScreen
        coins={coins}
        setCoins={setCoins}
        lastDailyClaim={lastDailyClaim}
        setLastDailyClaim={setLastDailyClaim}
        lastHourlyClaim={lastHourlyClaim}
        setLastHourlyClaim={setLastHourlyClaim}
        lastAdClaim={lastAdClaim}
        setLastAdClaim={setLastAdClaim}
        onRewardClaim={() => setRewardClaimCount((currentCount) => currentCount + 1)}
        onBack={() => setScreen("lobby")}
      />
    );
  }

  if (screen === "objectives") {
    return (
      <ObjectivesScreen
        coins={coins}
        setCoins={setCoins}
        spinCount={spinCount}
        winCount={winCount}
        rewardClaimCount={rewardClaimCount}
        neonDragonVisitCount={neonDragonVisitCount}
        claimedObjectives={claimedObjectives}
        setClaimedObjectives={setClaimedObjectives}
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
        <Text style={styles.logo}>ðŸŽ°</Text>

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
  onOpenRewards,
  onOpenObjectives,
}: {
  coins: number;
  onBack: () => void;
  onOpenNeonDragon: () => void;
  onOpenRewards: () => void;
  onOpenObjectives: () => void;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lobbyHeader}>
        <Text style={styles.smallLogo}>ðŸŽ° Lucky Quest Slots</Text>
        <Text style={styles.coinBalance}>ðŸª™ {coins.toLocaleString()} Coins</Text>
      </View>

      <View style={styles.lobbyCard}>
        <Text style={styles.sectionTitle}>Choose Your Quest</Text>
        <Text style={styles.sectionSubtitle}>
          Start with one free slot machine. More free slots are coming next.
        </Text>

        <SlotCard
          icon="ðŸ‰"
          title="Neon Dragon Fortune"
          description="Vegas neon, glowing gems, and dragon treasure."
          status="Playable"
          onPress={onOpenNeonDragon}
        />

        <SlotCard
          icon="ðŸ´â€â˜ ï¸"
          title="Pirate Moon Jackpot"
          description="Treasure maps, moonlit reels, and pirate rewards."
          status="Coming Soon"
        />

        <SlotCard
          icon="ðŸ±"
          title="Catsino Royale"
          description="Luxury casino cats, golden paws, and royal rewards."
          status="Coming Soon"
        />

        <View style={styles.row}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onOpenObjectives}>
            <Text style={styles.secondaryButtonText}>Objectives</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onOpenRewards}>
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

function RewardsScreen({
  coins,
  setCoins,
  lastDailyClaim,
  setLastDailyClaim,
  lastHourlyClaim,
  setLastHourlyClaim,
  lastAdClaim,
  setLastAdClaim,
  onRewardClaim,
  onBack,
}: {
  coins: number;
  setCoins: (coins: number) => void;
  lastDailyClaim: number | null;
  setLastDailyClaim: (time: number) => void;
  lastHourlyClaim: number | null;
  setLastHourlyClaim: (time: number) => void;
  lastAdClaim: number | null;
  setLastAdClaim: (time: number) => void;
  onRewardClaim: () => void;
  onBack: () => void;
}) {
  const [rewardMessage, setRewardMessage] = useState(
    "Claim free virtual rewards to continue playing."
  );

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dailyRemaining =
    lastDailyClaim === null
      ? 0
      : lastDailyClaim + DAILY_COOLDOWN_MS - currentTime;

  const hourlyRemaining =
    lastHourlyClaim === null
      ? 0
      : lastHourlyClaim + HOURLY_COOLDOWN_MS - currentTime;

  const adRemaining =
    lastAdClaim === null ? 0 : lastAdClaim + AD_COOLDOWN_MS - currentTime;

  const canClaimDaily = dailyRemaining <= 0;
  const canClaimHourly = hourlyRemaining <= 0;
  const canClaimAd = adRemaining <= 0;

  function claimReward(
    amount: number,
    rewardName: string,
    canClaim: boolean,
    onClaimTime: (time: number) => void,
    remainingTime: number
  ) {
    if (!canClaim) {
      setRewardMessage(
        `${rewardName} is not ready yet. Time remaining: ${formatTimeRemaining(
          remainingTime
        )}.`
      );
      return;
    }

    const now = Date.now();

    setCoins(coins + amount);
    onClaimTime(now);
    onRewardClaim();
    setCurrentTime(now);

    setRewardMessage(
      `${rewardName} claimed! You received ${amount.toLocaleString()} virtual coins.`
    );
  }

  return (
    <SafeAreaView style={styles.rewardsContainer}>
      <View style={styles.slotHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerLink}>â† Lobby</Text>
        </TouchableOpacity>

        <Text style={styles.headerCoins}>ðŸª™ {coins.toLocaleString()}</Text>
      </View>

      <View style={styles.rewardsCard}>
        <Text style={styles.rewardsTitle}>ðŸŽ Rewards</Text>

        <Text style={styles.rewardsSubtitle}>
          Earn free virtual coins through bonuses and optional rewarded ads.
        </Text>

        <RewardButton
          icon="ðŸŒ…"
          title="Daily Bonus"
          description={`Cooldown: ${formatTimeRemaining(dailyRemaining)}`}
          amount={DAILY_BONUS}
          disabled={!canClaimDaily}
          onPress={() =>
            claimReward(
              DAILY_BONUS,
              "Daily Bonus",
              canClaimDaily,
              setLastDailyClaim,
              dailyRemaining
            )
          }
        />

        <RewardButton
          icon="â°"
          title="Hourly Bonus"
          description={`Cooldown: ${formatTimeRemaining(hourlyRemaining)}`}
          amount={HOURLY_BONUS}
          disabled={!canClaimHourly}
          onPress={() =>
            claimReward(
              HOURLY_BONUS,
              "Hourly Bonus",
              canClaimHourly,
              setLastHourlyClaim,
              hourlyRemaining
            )
          }
        />

        <RewardButton
          icon="ðŸ“º"
          title="Watch Ad Reward"
          description={`Testing cooldown: ${formatTimeRemaining(adRemaining)}`}
          amount={REWARDED_AD_BONUS}
          disabled={!canClaimAd}
          onPress={() =>
            claimReward(
              REWARDED_AD_BONUS,
              "Rewarded Ad Bonus",
              canClaimAd,
              setLastAdClaim,
              adRemaining
            )
          }
        />

        <View style={styles.rewardMessageBox}>
          <Text style={styles.rewardMessageText}>{rewardMessage}</Text>
        </View>

        <Text style={styles.safeText}>
          Rewards are virtual only. No cashout. No real-world value.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function RewardButton({
  icon,
  title,
  description,
  amount,
  disabled,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  amount: number;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.rewardButton, disabled && styles.disabledRewardButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.rewardIcon}>{icon}</Text>

      <View style={styles.rewardTextBox}>
        <Text style={styles.rewardTitle}>{title}</Text>
        <Text style={styles.rewardDescription}>{description}</Text>
      </View>

      <Text style={disabled ? styles.rewardAmountDisabled : styles.rewardAmount}>
        {disabled ? "WAIT" : `+${amount.toLocaleString()}`}
      </Text>
    </TouchableOpacity>
  );
}

function ObjectivesScreen({
  coins,
  setCoins,
  spinCount,
  winCount,
  rewardClaimCount,
  neonDragonVisitCount,
  claimedObjectives,
  setClaimedObjectives,
  onBack,
}: {
  coins: number;
  setCoins: (coins: number) => void;
  spinCount: number;
  winCount: number;
  rewardClaimCount: number;
  neonDragonVisitCount: number;
  claimedObjectives: string[];
  setClaimedObjectives: (objectives: string[]) => void;
  onBack: () => void;
}) {
  function claimObjective(objectiveId: string, rewardAmount: number) {
    if (claimedObjectives.includes(objectiveId)) {
      return;
    }

    setCoins(coins + rewardAmount);
    setClaimedObjectives([...claimedObjectives, objectiveId]);
  }

  return (
    <SafeAreaView style={styles.objectivesContainer}>
      <View style={styles.slotHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerLink}>â† Lobby</Text>
        </TouchableOpacity>

        <Text style={styles.headerCoins}>ðŸª™ {coins.toLocaleString()}</Text>
      </View>

      <View style={styles.objectivesCard}>
        <Text style={styles.objectivesTitle}>ðŸŽ¯ Objectives</Text>

        <Text style={styles.objectivesSubtitle}>
          Complete tasks to earn free virtual coins.
        </Text>

        <ObjectiveCard
          objectiveId="spin-25"
          title="Spin 25 Times"
          description="Spin any slot machine 25 times."
          progress={spinCount}
          goal={25}
          reward={SPIN_OBJECTIVE_REWARD}
          claimedObjectives={claimedObjectives}
          onClaim={claimObjective}
        />

        <ObjectiveCard
          objectiveId="win-5"
          title="Win 5 Times"
          description="Get 5 winning spins."
          progress={winCount}
          goal={5}
          reward={WIN_OBJECTIVE_REWARD}
          claimedObjectives={claimedObjectives}
          onClaim={claimObjective}
        />

        <ObjectiveCard
          objectiveId="claim-reward-1"
          title="Claim 1 Reward"
          description="Claim any free reward from the Rewards screen."
          progress={rewardClaimCount}
          goal={1}
          reward={REWARD_CLAIM_OBJECTIVE_REWARD}
          claimedObjectives={claimedObjectives}
          onClaim={claimObjective}
        />

        <ObjectiveCard
          objectiveId="play-neon-dragon-1"
          title="Play Neon Dragon Fortune"
          description="Open Neon Dragon Fortune at least once."
          progress={neonDragonVisitCount}
          goal={1}
          reward={NEON_DRAGON_OBJECTIVE_REWARD}
          claimedObjectives={claimedObjectives}
          onClaim={claimObjective}
        />

        <Text style={styles.safeText}>
          Objective rewards are virtual only and cannot be redeemed.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function ObjectiveCard({
  objectiveId,
  title,
  description,
  progress,
  goal,
  reward,
  claimedObjectives,
  onClaim,
}: {
  objectiveId: string;
  title: string;
  description: string;
  progress: number;
  goal: number;
  reward: number;
  claimedObjectives: string[];
  onClaim: (objectiveId: string, rewardAmount: number) => void;
}) {
  const isComplete = progress >= goal;
  const isClaimed = claimedObjectives.includes(objectiveId);
  const shownProgress = Math.min(progress, goal);

  return (
    <View style={styles.objectiveCard}>
      <View style={styles.objectiveTextBox}>
        <Text style={styles.objectiveTitle}>{title}</Text>
        <Text style={styles.objectiveDescription}>{description}</Text>
        <Text style={styles.objectiveProgress}>
          Progress: {shownProgress}/{goal}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.objectiveClaimButton,
          (!isComplete || isClaimed) && styles.objectiveClaimButtonDisabled,
        ]}
        disabled={!isComplete || isClaimed}
        onPress={() => onClaim(objectiveId, reward)}
      >
        <Text style={styles.objectiveClaimText}>
          {isClaimed
            ? "Claimed"
            : isComplete
              ? `+${reward.toLocaleString()}`
              : "Locked"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function NeonDragonScreen({
  coins,
  setCoins,
  onSpin,
  onWin,
  onBack,
}: {
  coins: number;
  setCoins: (coins: number) => void;
  onSpin: () => void;
  onWin: () => void;
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

    function increaseBet(){
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
      onSpin();

      if (winAmount > 0) {
        onWin();
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
          <Text style={styles.headerLink}>â† Lobby</Text>
        </TouchableOpacity>

        <Text style={styles.headerCoins}>ðŸª™ {coins.toLocaleString()}</Text>
      </View>

      <Text style={styles.machineTitle}>ðŸ‰ Neon Dragon Fortune</Text>

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
            <Text style={styles.betButtonText}>âˆ’</Text>
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
    rewardsContainer: {
    flex: 1,
    backgroundColor: "#080816",
    padding: 20,
    alignItems: "center",
  },
  rewardsCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#14142b",
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: "#f5c542",
  },
  rewardsTitle: {
    color: "#f5c542",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  rewardsSubtitle: {
    color: "#d7d7ff",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 18,
  },
  rewardButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22224a",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#9d4edd",
  },
  disabledRewardButton: {
    opacity: 0.55,
    borderColor: "#444466",
  },
  rewardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  rewardTextBox: {
    flex: 1,
  },
  rewardTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  rewardDescription: {
    color: "#c9c9e8",
    fontSize: 13,
    lineHeight: 18,
  },
  rewardAmount: {
    color: "#7CFF9B",
    fontSize: 15,
    fontWeight: "900",
  },
  rewardAmountDisabled: {
    color: "#bbbbcc",
    fontSize: 13,
    fontWeight: "900",
  },
  rewardMessageBox: {
    backgroundColor: "#202044",
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#444466",
  },
  rewardMessageText: {
    color: "#d7d7ff",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
    objectivesContainer: {
    flex: 1,
    backgroundColor: "#080816",
    padding: 20,
    alignItems: "center",
  },
  objectivesCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#14142b",
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: "#f5c542",
  },
  objectivesTitle: {
    color: "#f5c542",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  objectivesSubtitle: {
    color: "#d7d7ff",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 18,
  },
  objectiveCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22224a",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#9d4edd",
  },
  objectiveTextBox: {
    flex: 1,
    marginRight: 10,
  },
  objectiveTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  objectiveDescription: {
    color: "#c9c9e8",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  objectiveProgress: {
    color: "#f5c542",
    fontSize: 13,
    fontWeight: "800",
  },
  objectiveClaimButton: {
    backgroundColor: "#8a2be2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 88,
    alignItems: "center",
  },
  objectiveClaimButtonDisabled: {
    opacity: 0.45,
  },
  objectiveClaimText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
  },
});