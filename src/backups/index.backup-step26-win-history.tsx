import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import {
  AD_COOLDOWN_MS,
  BET_OPTIONS,
  DAILY_BONUS,
  DAILY_COOLDOWN_MS,
  DEFAULT_BET,
  FREE_SPIN_TOKEN_REWARD,
  HOURLY_BONUS,
  HOURLY_COOLDOWN_MS,
  JACKPOT_MAX_PROGRESS,
  JACKPOT_PROGRESS_PER_SPIN,
  JACKPOT_REWARD,
  LEVEL_UP_COIN_REWARD,
  LOSS_SHIELD_REFUND_RATE,
  LOSS_SHIELD_SPIN_DURATION,
  LOSS_SHIELD_TOKEN_REWARD,
  NEON_DRAGON_OBJECTIVE_REWARD,
  OBJECTIVE_CLAIM_XP_REWARD,
  REWARD_CLAIM_OBJECTIVE_REWARD,
  REWARDED_AD_BONUS,
  SAVE_KEY,
  SPIN_OBJECTIVE_REWARD,
  SPIN_XP_REWARD,
  STARTING_COINS,
  STARTING_FREE_SPIN_TOKENS,
  STARTING_JACKPOT_PROGRESS,
  STARTING_LOSS_SHIELD_TOKENS,
  WIN_OBJECTIVE_REWARD,
  WIN_XP_REWARD
} from "../constants/gameConfig";

import {
  calculateMiddleRowWin,
  createRandomReels,
  formatTimeRemaining,
  getXpNeededForNextLevel,
} from "../utils/gameUtils";

type Screen =
  | "welcome"
  | "lobby"
  | "neonDragon"
  | "rewards"
  | "objectives"
  | "settings";

type GameSaveData = {
  coins: number;
  playerLevel: number;
  playerXp: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  jackpotProgress: number;
  freeSpinTokens: number;
  lossShieldTokens: number;
  lossShieldSpinsRemaining: number;
  lastDailyClaim: number | null;
  lastHourlyClaim: number | null;
  lastAdClaim: number | null;
  spinCount: number;
  winCount: number;
  rewardClaimCount: number;
  neonDragonVisitCount: number;
  claimedObjectives: string[];
};

export default function HomeScreen() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [coins, setCoins] = useState(STARTING_COINS);

  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXp, setPlayerXp] = useState(0);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [jackpotProgress, setJackpotProgress] = useState(
    STARTING_JACKPOT_PROGRESS
  );

  const [freeSpinTokens, setFreeSpinTokens] = useState(STARTING_FREE_SPIN_TOKENS);

  const [lossShieldTokens, setLossShieldTokens] = useState(
    STARTING_LOSS_SHIELD_TOKENS
  );
  const [lossShieldSpinsRemaining, setLossShieldSpinsRemaining] = useState(0);

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
        const savedData = await AsyncStorage.getItem(SAVE_KEY);

        if (savedData !== null) {
          const parsedSave: GameSaveData = JSON.parse(savedData);

          setCoins(parsedSave.coins ?? STARTING_COINS);
          setPlayerLevel(parsedSave.playerLevel ?? 1);
          setPlayerXp(parsedSave.playerXp ?? 0);
          setSoundEnabled(parsedSave.soundEnabled ?? true);
          setMusicEnabled(parsedSave.musicEnabled ?? true);
          setVibrationEnabled(parsedSave.vibrationEnabled ?? true);
          setJackpotProgress(
            parsedSave.jackpotProgress ?? STARTING_JACKPOT_PROGRESS
          );
          setFreeSpinTokens(parsedSave.freeSpinTokens ?? STARTING_FREE_SPIN_TOKENS);
          setLossShieldTokens(
            parsedSave.lossShieldTokens ?? STARTING_LOSS_SHIELD_TOKENS
          );
          setLossShieldSpinsRemaining(parsedSave.lossShieldSpinsRemaining ?? 0);
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
        playerLevel,
        playerXp,
        soundEnabled,
        musicEnabled,
        vibrationEnabled,
        jackpotProgress,
        freeSpinTokens,
        lossShieldTokens,
        lossShieldSpinsRemaining,
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
        await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      } catch (error) {
        console.log("Failed to save game data:", error);
      }
    }

  saveGameData();
},[
  coins,
  playerLevel,
  playerXp,
  soundEnabled,
  musicEnabled,
  vibrationEnabled,
  jackpotProgress,
  freeSpinTokens,
  lossShieldTokens,
  lossShieldSpinsRemaining,
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
          <Text style={styles.logo}>🎰</Text>
          <Text style={styles.title}>Lucky Quest Slots</Text>
          <Text style={styles.subtitle}>Loading your quest...</Text>
        </View>
      </SafeAreaView>
    );
  }

  function awardXp(amount: number) {
    let nextXp = playerXp + amount;
    let nextLevel = playerLevel;
    let levelUpCoinReward = 0;

    while (nextXp >= getXpNeededForNextLevel(nextLevel)) {
      nextXp -= getXpNeededForNextLevel(nextLevel);
      nextLevel += 1;
      levelUpCoinReward += LEVEL_UP_COIN_REWARD;
    }

    setPlayerXp(nextXp);
    setPlayerLevel(nextLevel);

    if (levelUpCoinReward > 0) {
      setCoins((currentCoins) => currentCoins + levelUpCoinReward);

      return ` Level up! You reached Level ${nextLevel} and earned ${levelUpCoinReward.toLocaleString()} bonus coins.`;
    }

    return "";
  }

  async function resetProgress() {
    try {
      await AsyncStorage.removeItem(SAVE_KEY);
    } catch (error) {
      console.log("Failed to reset save data:", error);
    }

    setCoins(STARTING_COINS);
    setPlayerLevel(1);
    setPlayerXp(0);
    setSoundEnabled(true);
    setMusicEnabled(true);
    setVibrationEnabled(true);
    setJackpotProgress(STARTING_JACKPOT_PROGRESS);
    setFreeSpinTokens(STARTING_FREE_SPIN_TOKENS);
    setLossShieldTokens(STARTING_LOSS_SHIELD_TOKENS);
    setLossShieldSpinsRemaining(0);
    setLastDailyClaim(null);
    setLastHourlyClaim(null);
    setLastAdClaim(null);
    setSpinCount(0);
    setWinCount(0);
    setRewardClaimCount(0);
    setNeonDragonVisitCount(0);
    setClaimedObjectives([]);
    setScreen("welcome");
  }

  function playButtonSound() {
    if (!soundEnabled) {
      return;
    }

    // Sound placeholder: real button sound will be added later.
  }

  function playSpinSound() {
    if (!soundEnabled) {
      return;
    }

    // Sound placeholder: real slot spin sound will be added later.
  }

  function playWinSound() {
    if (!soundEnabled) {
      return;
    }

    // Sound placeholder: real win sound will be added later.
  }

  function playWarningSound() {
    if (!soundEnabled) {
      return;
    }

    // Sound placeholder: real warning/error sound will be added later.
  }

  function playTapFeedback() {
    if (!vibrationEnabled) {
      return;
    }

    Haptics.selectionAsync();
  }

  function playSpinFeedback() {
    if (!vibrationEnabled) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function playWinFeedback() {
    if (!vibrationEnabled) {
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function playWarningFeedback() {
    if (!vibrationEnabled) {
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  if (screen === "lobby") {
    return (
      <LobbyScreen
        coins={coins}
        playerLevel={playerLevel}
        playerXp={playerXp}
        onBack={() => setScreen("welcome")}
        onOpenNeonDragon={() => {
          setNeonDragonVisitCount((currentCount) => currentCount + 1);
          setScreen("neonDragon");
        }}
        onOpenRewards={() => setScreen("rewards")}
        onOpenObjectives={() => setScreen("objectives")}
        onOpenSettings={() => setScreen("settings")}
      />
    );
  }

  if (screen === "neonDragon") {
    return (
      <NeonDragonScreen
        coins={coins}
        setCoins={setCoins}
        playerLevel={playerLevel}
        playerXp={playerXp}
        jackpotProgress={jackpotProgress}
        setJackpotProgress={setJackpotProgress}
        freeSpinTokens={freeSpinTokens}
        setFreeSpinTokens={setFreeSpinTokens}
        lossShieldTokens={lossShieldTokens}
        setLossShieldTokens={setLossShieldTokens}
        lossShieldSpinsRemaining={lossShieldSpinsRemaining}
        setLossShieldSpinsRemaining={setLossShieldSpinsRemaining}
        onAwardXp={awardXp}
        onButtonSound={playButtonSound}
        onSpinSound={playSpinSound}
        onWinSound={playWinSound}
        onWarningSound={playWarningSound}
        onTapFeedback={playTapFeedback}
        onSpinFeedback={playSpinFeedback}
        onWinFeedback={playWinFeedback}
        onWarningFeedback={playWarningFeedback}
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
        freeSpinTokens={freeSpinTokens}
        setFreeSpinTokens={setFreeSpinTokens}
        lossShieldTokens={lossShieldTokens}
        setLossShieldTokens={setLossShieldTokens}
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
        onAwardXp={awardXp}
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

  if (screen === "settings") {
    return (
      <SettingsScreen
        coins={coins}
        playerLevel={playerLevel}
        playerXp={playerXp}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        musicEnabled={musicEnabled}
        setMusicEnabled={setMusicEnabled}
        vibrationEnabled={vibrationEnabled}
        setVibrationEnabled={setVibrationEnabled}
        jackpotProgress={jackpotProgress}
        freeSpinTokens={freeSpinTokens}
        lossShieldTokens={lossShieldTokens}
        lossShieldSpinsRemaining={lossShieldSpinsRemaining}
        onResetProgress={resetProgress}
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
  playerLevel,
  playerXp,
  onBack,
  onOpenNeonDragon,
  onOpenRewards,
  onOpenObjectives,
  onOpenSettings,
}: {
  coins: number;
  playerLevel: number;
  playerXp: number;
  onBack: () => void;
  onOpenNeonDragon: () => void;
  onOpenRewards: () => void;
  onOpenObjectives: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lobbyHeader}>
        <Text style={styles.smallLogo}>🎰 Lucky Quest Slots</Text>
        <Text style={styles.coinBalance}>🪙 {coins.toLocaleString()} Coins</Text>
        <Text style={styles.levelText}>
          Level {playerLevel} · XP {playerXp}/{getXpNeededForNextLevel(playerLevel)}
        </Text>
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
          <TouchableOpacity style={styles.secondaryButton} onPress={onOpenObjectives}>
            <Text style={styles.secondaryButtonText}>Objectives</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onOpenRewards}>
            <Text style={styles.secondaryButtonText}>Rewards</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.settingsButton} onPress={onOpenSettings}>
          <Text style={styles.secondaryButtonText}>Settings</Text>
        </TouchableOpacity>

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
  freeSpinTokens,
  setFreeSpinTokens,
  lossShieldTokens,
  setLossShieldTokens,
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
  freeSpinTokens: number;
  setFreeSpinTokens: (tokens: number) => void;
  lossShieldTokens: number;
  setLossShieldTokens: (tokens: number) => void;
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

  function claimFreeSpinTokens() {
    setFreeSpinTokens(freeSpinTokens + FREE_SPIN_TOKEN_REWARD);
    setRewardMessage(
      `Free Spin Tokens claimed! You received ${FREE_SPIN_TOKEN_REWARD} free spins.`
    );
  }

  function claimLossShieldTokens() {
    setLossShieldTokens(lossShieldTokens + LOSS_SHIELD_TOKEN_REWARD);
    setRewardMessage(
      `Loss Shield Tokens claimed! You received ${LOSS_SHIELD_TOKEN_REWARD} shield tokens.`
    );
  }

  return (
    <SafeAreaView style={styles.rewardsContainer}>
      <View style={styles.slotHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerLink}>← Lobby</Text>
        </TouchableOpacity>

        <Text style={styles.headerCoins}>🪙 {coins.toLocaleString()}</Text>
      </View>

      <View style={styles.rewardsCard}>
        <Text style={styles.rewardsTitle}>🎁 Rewards</Text>

        <Text style={styles.rewardsSubtitle}>
          Earn free virtual coins through bonuses and optional rewarded ads.
        </Text>

        <RewardButton
          icon="🌅"
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
          icon="⏰"
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
          icon="📺"
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

        <RewardButton
          icon="🎟️"
          title="Free Spin Tokens"
          description={`Testing reward. Current tokens: ${freeSpinTokens}`}
          amount={FREE_SPIN_TOKEN_REWARD}
          onPress={claimFreeSpinTokens}
        />

        <RewardButton
          icon="🛡️"
          title="Loss Shield Tokens"
          description={`Testing reward. Current tokens: ${lossShieldTokens}`}
          amount={LOSS_SHIELD_TOKEN_REWARD}
          onPress={claimLossShieldTokens}
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
  onAwardXp,
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
  onAwardXp: (amount: number) => string;
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
    onAwardXp(OBJECTIVE_CLAIM_XP_REWARD);
  }

  return (
    <SafeAreaView style={styles.objectivesContainer}>
      <View style={styles.slotHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerLink}>← Lobby</Text>
        </TouchableOpacity>

        <Text style={styles.headerCoins}>🪙 {coins.toLocaleString()}</Text>
      </View>

      <View style={styles.objectivesCard}>
        <Text style={styles.objectivesTitle}>🎯 Objectives</Text>

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

function SettingsScreen({
  coins,
  playerLevel,
  playerXp,
  soundEnabled,
  setSoundEnabled,
  musicEnabled,
  setMusicEnabled,
  vibrationEnabled,
  setVibrationEnabled,
  jackpotProgress,
  freeSpinTokens,
  lossShieldTokens,
  lossShieldSpinsRemaining,
  onResetProgress,
  onBack,
}: {
  coins: number;
  playerLevel: number;
  playerXp: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => void;
  jackpotProgress: number;
  freeSpinTokens: number;
  lossShieldTokens: number;
  lossShieldSpinsRemaining: number;
  onResetProgress: () => void;
  onBack: () => void;
}) {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  return (
    <SafeAreaView style={styles.settingsContainer}>
      <View style={styles.slotHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerLink}>← Lobby</Text>
        </TouchableOpacity>

        <Text style={styles.headerCoins}>⚙️ Settings</Text>
      </View>

      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>Settings</Text>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Audio & Feedback</Text>

          <SettingsToggleRow
            label="Sound Effects"
            value={soundEnabled}
            onToggle={() => setSoundEnabled(!soundEnabled)}
          />

          <SettingsToggleRow
            label="Music"
            value={musicEnabled}
            onToggle={() => setMusicEnabled(!musicEnabled)}
          />

          <SettingsToggleRow
            label="Vibration"
            value={vibrationEnabled}
            onToggle={() => setVibrationEnabled(!vibrationEnabled)}
          />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Saved Progress</Text>
          <Text style={styles.settingsText}>Coins: {coins.toLocaleString()}</Text>
          <Text style={styles.settingsText}>
            Level: {playerLevel} · XP: {playerXp}
          </Text>
          <Text style={styles.settingsText}>
            Dragon Jackpot Meter: {jackpotProgress}%
          </Text>
          <Text style={styles.settingsText}>
            Free Spin Tokens: {freeSpinTokens}
          </Text>
          <Text style={styles.settingsText}>
            Loss Shield Tokens: {lossShieldTokens}
          </Text>
          <Text style={styles.settingsText}>
            Active Loss Shield Spins: {lossShieldSpinsRemaining}
          </Text>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Entertainment Notice</Text>
          <Text style={styles.settingsText}>
            Lucky Quest Slots is intended for adults 18+ and is for entertainment
            only. This app does not offer real-money gambling, real-money prizes,
            cash payouts, sweepstakes entries, gift cards, or anything of
            real-world value. All coins, boosters, jackpots, and rewards are
            virtual and cannot be purchased, sold, traded, transferred, or
            redeemed.
          </Text>
        </View>

        {!isConfirmingReset ? (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setIsConfirmingReset(true)}
          >
            <Text style={styles.resetButtonText}>Reset Progress</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.confirmResetBox}>
            <Text style={styles.confirmResetText}>
              Are you sure? This will erase your saved coins, XP, rewards,
              objectives, and boosters.
            </Text>

            <TouchableOpacity
              style={styles.confirmResetButton}
              onPress={onResetProgress}
            >
              <Text style={styles.resetButtonText}>Yes, Reset Everything</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelResetButton}
              onPress={() => setIsConfirmingReset(false)}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.safeText}>
          Local save only. No account or cloud save in MVP.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function SettingsToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.settingsToggleRow}>
      <Text style={styles.settingsText}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.settingsToggleButton,
          value ? styles.settingsToggleButtonOn : styles.settingsToggleButtonOff,
        ]}
        onPress={onToggle}
      >
        <Text style={styles.settingsToggleButtonText}>
          {value ? "ON" : "OFF"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function NeonDragonScreen({
  coins,
  setCoins,
  playerLevel,
  playerXp,
  jackpotProgress,
  setJackpotProgress,
  onAwardXp,
  onButtonSound,
  onSpinSound,
  onWinSound,
  onWarningSound,
  onTapFeedback,
  onSpinFeedback,
  onWinFeedback,
  onWarningFeedback,
  freeSpinTokens,
  setFreeSpinTokens,
  lossShieldTokens,
  setLossShieldTokens,
  lossShieldSpinsRemaining,
  setLossShieldSpinsRemaining,
  onSpin,
  onWin,
  onBack,
}: {
  coins: number;
  setCoins: (coins: number) => void;
  playerLevel: number;
  playerXp: number;
  jackpotProgress: number;
  setJackpotProgress: (progress: number) => void;
  onAwardXp: (amount: number) => string;
  onButtonSound: () => void;
  onSpinSound: () => void;
  onWinSound: () => void;
  onWarningSound: () => void;
  onTapFeedback: () => void;
  onSpinFeedback: () => void;
  onWinFeedback: () => void;
  onWarningFeedback: () => void;
  freeSpinTokens: number;
  setFreeSpinTokens: (tokens: number) => void;
  lossShieldTokens: number;
  setLossShieldTokens: (tokens: number) => void;
  lossShieldSpinsRemaining: number;
  setLossShieldSpinsRemaining: (spins: number) => void;
  onSpin: () => void;
  onWin: () => void;
  onBack: () => void;
}) {
  const [reels, setReels] = useState<string[][]>(createRandomReels());
  const [resultMessage, setResultMessage] = useState("Ready to spin.");
  const [lastWin, setLastWin] = useState(0);
  const [betAmount, setBetAmount] = useState(DEFAULT_BET);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winHistory, setWinHistory] = useState<string[]>([]);
  const spinAnimationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    return () => {
      if (spinAnimationRef.current) {
        clearInterval(spinAnimationRef.current);
      }
    };
  }, []);

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

    function activateLossShield() {
      if (isSpinning) {
        onWarningSound();
        return;
      }

      if (lossShieldSpinsRemaining > 0) {
        onWarningSound();
        onWarningFeedback();
        setResultMessage("Loss Shield is already active.");
        return;
      }

      if (lossShieldTokens <= 0) {
        onWarningSound();
        onWarningFeedback();
        setResultMessage("No Loss Shield Tokens available.");
        return;
      }

      onButtonSound();
      onTapFeedback();
      setLossShieldTokens(lossShieldTokens - 1);
      setLossShieldSpinsRemaining(LOSS_SHIELD_SPIN_DURATION);
      setResultMessage(
        `Loss Shield activated for ${LOSS_SHIELD_SPIN_DURATION} spins. Losing spins refund 20% of your bet.`
      );
    }

    function startReelAnimation() {
    if (spinAnimationRef.current) {
      clearInterval(spinAnimationRef.current);
    }

    spinAnimationRef.current = setInterval(() => {
      setReels(createRandomReels());
    }, 90);
  }

  function stopReelAnimation() {
    if (spinAnimationRef.current) {
      clearInterval(spinAnimationRef.current);
      spinAnimationRef.current = null;
    }
  }

  function addWinHistoryEntry(entry: string) {
    setWinHistory((currentHistory) => [entry, ...currentHistory].slice(0, 5));
  }

  function handleSpin(useFreeSpin = false) {
    if (isSpinning) {
      onWarningSound();
      return;
    }

    if (useFreeSpin && freeSpinTokens <= 0) {
      onWarningSound();
      onWarningFeedback();
      setResultMessage("No Free Spin Tokens available.");
      setLastWin(0);
      return;
    }

    if (!useFreeSpin && coins < betAmount) {
      onWarningSound();
      onWarningFeedback();
      setResultMessage("Not enough coins for this bet. Lower your bet or claim a reward.");
      setLastWin(0);
      return;
    }

    onSpinSound();
    onSpinFeedback();
    setIsSpinning(true);
    setLastWin(0);
    startReelAnimation();

    if (useFreeSpin) {
      setResultMessage("Your free spin is starting...");
    } else {
      setResultMessage("The dragon reels are spinning...");
    }

    setTimeout(() => {
      stopReelAnimation();

      const newReels = createRandomReels();
      const winAmount = calculateMiddleRowWin(newReels, betAmount);
      const coinCost = useFreeSpin ? 0 : betAmount;

      const shieldWasActive = lossShieldSpinsRemaining > 0;
      const isLosingSpin = winAmount === 0;
      const shieldRefund =
        shieldWasActive && isLosingSpin && !useFreeSpin
          ? Math.floor(betAmount * LOSS_SHIELD_REFUND_RATE)
          : 0;

      const newShieldSpinsRemaining = shieldWasActive
        ? Math.max(lossShieldSpinsRemaining - 1, 0)
        : 0;

      const nextJackpotProgressRaw = jackpotProgress + JACKPOT_PROGRESS_PER_SPIN;
      const jackpotTriggered = nextJackpotProgressRaw >= JACKPOT_MAX_PROGRESS;
      const jackpotBonus = jackpotTriggered ? JACKPOT_REWARD : 0;
      const newJackpotProgress = jackpotTriggered
        ? nextJackpotProgressRaw % JACKPOT_MAX_PROGRESS
        : Math.min(nextJackpotProgressRaw, JACKPOT_MAX_PROGRESS);

      const jackpotMessage = jackpotTriggered
        ? ` Dragon Jackpot filled! You earned ${JACKPOT_REWARD.toLocaleString()} virtual coins.`
        : "";

      if (jackpotTriggered) {
        addWinHistoryEntry(`Jackpot +${JACKPOT_REWARD.toLocaleString()}`);
      }

      const newCoinBalance =
        coins - coinCost + winAmount + shieldRefund + jackpotBonus;

      setReels(newReels);
      setCoins(newCoinBalance);
      setLastWin(winAmount);
      setLossShieldSpinsRemaining(newShieldSpinsRemaining);
      setJackpotProgress(newJackpotProgress);
      onSpin();

      if (useFreeSpin) {
        setFreeSpinTokens(freeSpinTokens - 1);
      }

      let earnedXp = SPIN_XP_REWARD;

      if (winAmount > 0) {
        onWinSound();
        onWinFeedback();
        onWin();
        earnedXp += WIN_XP_REWARD;

        addWinHistoryEntry(
          `${useFreeSpin ? "Free Spin · " : ""}Win +${winAmount.toLocaleString()}`
        );

        const xpMessage = onAwardXp(earnedXp);

        setResultMessage(
            `Payline win! You won ${winAmount.toLocaleString()} coins and earned ${earnedXp} XP.${xpMessage}${jackpotMessage}`
        );
      } else {
        const xpMessage = onAwardXp(earnedXp);

        addWinHistoryEntry(
          shieldRefund > 0
            ? `${useFreeSpin ? "Free Spin · " : ""}No win · Shield +${shieldRefund.toLocaleString()}`
            : `${useFreeSpin ? "Free Spin · " : ""}No win`
        );

        if (shieldRefund > 0) {
          setResultMessage(
              `No win this spin. Loss Shield refunded ${shieldRefund.toLocaleString()} coins. You earned ${earnedXp} XP.${xpMessage}${jackpotMessage}`
          );
        } else {
          setResultMessage(
            `No win this spin. You earned ${earnedXp} XP.${xpMessage}${jackpotMessage}`
          );
        }
      }

      setIsSpinning(false);
    }, 700);
  }

  return (
    <SafeAreaView style={styles.slotContainer}>
      <ScrollView
        style={styles.slotScrollView}
        contentContainerStyle={styles.slotScrollContent}
        showsVerticalScrollIndicator={false}
      >
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

      <Text style={styles.levelText}>
        Level {playerLevel} · XP {playerXp}/{getXpNeededForNextLevel(playerLevel)}
      </Text>

      <Text style={styles.freeSpinText}>
        🎟️ Free Spin Tokens: {freeSpinTokens}
      </Text>

      <Text style={styles.lossShieldText}>
        🛡️ Loss Shields: {lossShieldTokens} · Active Spins:{" "}
        {lossShieldSpinsRemaining}
      </Text>

      <View style={styles.jackpotBox}>
        <View style={styles.jackpotHeaderRow}>
          <Text style={styles.jackpotTitle}>🐉 Dragon Jackpot Meter</Text>
          <Text style={styles.jackpotPercent}>{jackpotProgress}%</Text>
        </View>

        <View style={styles.jackpotTrack}>
          <View
            style={[
              styles.jackpotFill,
              { width: `${Math.min(jackpotProgress, JACKPOT_MAX_PROGRESS)}%` },
            ]}
          />
        </View>

        <Text style={styles.jackpotText}>
          Fill the meter through spins to earn a virtual coin jackpot.
        </Text>
      </View>

      <View style={styles.paylineInfoBox}>
        <Text style={styles.paylineInfoTitle}>Middle Payline</Text>
        <Text style={styles.paylineInfoText}>
          Match 3+ symbols from left to right on the glowing middle row.
        </Text>
      </View>

      <View style={styles.reelBoard}>
        {reels.map((reel, reelIndex) => (
          <View key={reelIndex} style={styles.reel}>
            {reel.map((symbol, symbolIndex) => (
              <View
                key={symbolIndex}
                style={[
                  styles.symbolBox,
                  symbolIndex === 1 && styles.middlePaylineSymbolBox,
                ]}
              >
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

      <View style={styles.historyBox}>
        <Text style={styles.historyTitle}>Recent Spins</Text>

        {winHistory.length === 0 ? (
          <Text style={styles.historyEmptyText}>No spins yet this session.</Text>
        ) : (
          winHistory.map((entry, index) => (
            <Text key={`${entry}-${index}`} style={styles.historyText}>
              {entry}
            </Text>
          ))
        )}
      </View>

      <View style={styles.payoutBox}>
        <Text style={styles.payoutTitle}>Payouts</Text>

        <View style={styles.payoutRow}>
          <Text style={styles.payoutText}>3 left-to-right matches</Text>
          <Text style={styles.payoutValue}>Bet × 5</Text>
        </View>

        <View style={styles.payoutRow}>
          <Text style={styles.payoutText}>4 left-to-right matches</Text>
          <Text style={styles.payoutValue}>Bet × 15</Text>
        </View>

        <View style={styles.payoutRow}>
          <Text style={styles.payoutText}>5 left-to-right matches</Text>
          <Text style={styles.payoutValue}>Bet × 50</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.disabledSpinButton]}
        onPress={() => handleSpin(false)}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>
          {isSpinning ? "SPINNING..." : "SPIN"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.freeSpinButton,
          (isSpinning || freeSpinTokens <= 0) && styles.disabledSpinButton,
        ]}
        onPress={() => handleSpin(true)}
        disabled={isSpinning || freeSpinTokens <= 0}
      >
        <Text style={styles.freeSpinButtonText}>
          Use Free Spin 🎟️
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.lossShieldButton,
          (isSpinning || lossShieldTokens <= 0 || lossShieldSpinsRemaining > 0) &&
            styles.disabledSpinButton,
        ]}
        onPress={activateLossShield}
        disabled={isSpinning || lossShieldTokens <= 0 || lossShieldSpinsRemaining > 0}
      >
        <Text style={styles.lossShieldButtonText}>
          Activate Loss Shield 🛡️
        </Text>
      </TouchableOpacity>

      <Text style={styles.safeText}>
        Virtual coins only. No cashout. Entertainment only.
      </Text>
    </ScrollView>  
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
    color: "#f5c542",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 4,
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
},
slotScrollView: {
  flex: 1,
  width: "100%",
},
slotScrollContent: {
  padding: 14,
  alignItems: "center",
  paddingBottom: 28,
},
slotHeader: {
  width: "100%",
  maxWidth: 500,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 4,
  marginBottom: 8,
},
headerLink: {
  color: "#d7d7ff",
  fontSize: 15,
  fontWeight: "800",
},
headerCoins: {
  color: "#f5c542",
  fontSize: 17,
  fontWeight: "800",
},
machineTitle: {
  color: "#f5c542",
  fontSize: 28,
  fontWeight: "900",
  textAlign: "center",
  marginTop: 2,
  marginBottom: 4,
},
machineSubtitle: {
  color: "#d7d7ff",
  fontSize: 13,
  textAlign: "center",
  marginBottom: 6,
},
levelText: {
  color: "#d7d7ff",
  fontSize: 13,
  fontWeight: "700",
  textAlign: "center",
  marginTop: 2,
  marginBottom: 4,
},
freeSpinText: {
  color: "#7CFF9B",
  fontSize: 13,
  fontWeight: "800",
  textAlign: "center",
  marginBottom: 4,
},
lossShieldText: {
  color: "#9bdcff",
  fontSize: 13,
  fontWeight: "800",
  textAlign: "center",
  marginBottom: 8,
},
jackpotBox: {
  width: "100%",
  maxWidth: 500,
  backgroundColor: "#1a1433",
  borderRadius: 16,
  padding: 10,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: "#f5c542",
},
jackpotHeaderRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 6,
},
jackpotTitle: {
  color: "#f5c542",
  fontSize: 14,
  fontWeight: "900",
},
jackpotPercent: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "900",
},
jackpotTrack: {
  width: "100%",
  height: 10,
  backgroundColor: "#30294f",
  borderRadius: 999,
  overflow: "hidden",
  marginBottom: 6,
},
jackpotFill: {
  height: "100%",
  backgroundColor: "#f5c542",
  borderRadius: 999,
},
jackpotText: {
  color: "#d7d7ff",
  fontSize: 11,
  textAlign: "center",
},
paylineInfoBox: {
  width: "100%",
  maxWidth: 500,
  backgroundColor: "#202044",
  borderRadius: 14,
  padding: 8,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: "#f5c542",
},
paylineInfoTitle: {
  color: "#f5c542",
  fontSize: 13,
  fontWeight: "900",
  textAlign: "center",
  marginBottom: 2,
},
paylineInfoText: {
  color: "#d7d7ff",
  fontSize: 12,
  textAlign: "center",
  lineHeight: 16,
},
reelBoard: {
  width: "100%",
  maxWidth: 500,
  flexDirection: "row",
  justifyContent: "center",
  backgroundColor: "#14142b",
  borderRadius: 20,
  borderWidth: 2,
  borderColor: "#f5c542",
  padding: 10,
  marginBottom: 10,
},
reel: {
  flex: 1,
  gap: 3,
  alignItems: "center",
},
symbolBox: {
  width: 52,
  height: 58,
  backgroundColor: "#202044",
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  marginVertical: 3,
  borderWidth: 1,
  borderColor: "#444466",
},
middlePaylineSymbolBox: {
  borderColor: "#f5c542",
  backgroundColor: "#30294f",
  shadowColor: "#f5c542",
  shadowOpacity: 0.5,
  shadowRadius: 6,
},
symbol: {
  fontSize: 28,
},
betBox: {
  width: "100%",
  maxWidth: 500,
  backgroundColor: "#14142b",
  borderRadius: 16,
  padding: 10,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: "#444466",
},
betText: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "800",
  textAlign: "center",
  marginBottom: 8,
},
betControls: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  marginBottom: 8,
},
betButton: {
  flex: 1,
  backgroundColor: "#202044",
  paddingVertical: 8,
  borderRadius: 12,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#444466",
},
disabledButton: {
  opacity: 0.45,
},
betButtonText: {
  color: "#ffffff",
  fontSize: 24,
  fontWeight: "900",
},
betChoice: {
  color: "#f5c542",
  fontSize: 18,
  fontWeight: "900",
  minWidth: 76,
  textAlign: "center",
},
winText: {
  color: "#7CFF9B",
  fontSize: 13,
  fontWeight: "800",
  textAlign: "center",
  marginBottom: 4,
},
resultText: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "700",
  textAlign: "center",
  lineHeight: 19,
},
historyBox: {
  width: "100%",
  maxWidth: 500,
  backgroundColor: "#14142b",
  borderRadius: 16,
  padding: 10,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: "#444466",
},
historyTitle: {
  color: "#f5c542",
  fontSize: 14,
  fontWeight: "900",
  textAlign: "center",
  marginBottom: 6,
},
historyText: {
  color: "#d7d7ff",
  fontSize: 12,
  textAlign: "center",
  marginBottom: 3,
},
historyEmptyText: {
  color: "#9999bb",
  fontSize: 12,
  textAlign: "center",
},
payoutBox: {
  width: "100%",
  maxWidth: 500,
  backgroundColor: "#14142b",
  borderRadius: 16,
  padding: 10,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: "#444466",
},
payoutTitle: {
  color: "#f5c542",
  fontSize: 14,
  fontWeight: "900",
  textAlign: "center",
  marginBottom: 4,
},
payoutRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 3,
},
payoutText: {
  color: "#c9c9e8",
  fontSize: 12,
},
payoutValue: {
  color: "#7CFF9B",
  fontSize: 12,
  fontWeight: "900",
},
spinButton: {
  width: "100%",
  maxWidth: 500,
  backgroundColor: "#8a2be2",
  paddingVertical: 14,
  borderRadius: 18,
  alignItems: "center",
  marginBottom: 8,
},
disabledSpinButton: {
  opacity: 0.65,
},
spinButtonText: {
  color: "#ffffff",
  fontSize: 22,
  fontWeight: "900",
  letterSpacing: 2,
},
freeSpinButton: {
  width: "100%",
  maxWidth: 500,
  backgroundColor: "#202044",
  paddingVertical: 10,
  borderRadius: 14,
  alignItems: "center",
  marginBottom: 8,
  borderWidth: 1,
  borderColor: "#7CFF9B",
},
freeSpinButtonText: {
  color: "#7CFF9B",
  fontSize: 15,
  fontWeight: "900",
},
lossShieldButton: {
  width: "100%",
  maxWidth: 500,
  backgroundColor: "#202044",
  paddingVertical: 10,
  borderRadius: 14,
  alignItems: "center",
  marginBottom: 8,
  borderWidth: 1,
  borderColor: "#9bdcff",
},
lossShieldButtonText: {
  color: "#9bdcff",
  fontSize: 15,
  fontWeight: "900",
},
safeText: {
  color: "#9999bb",
  fontSize: 11,
  textAlign: "center",
  marginTop: 4,
  lineHeight: 15,
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
  settingsButton: {
  backgroundColor: "#202044",
  borderRadius: 14,
  paddingVertical: 14,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#444466",
  marginTop: 12,
},
settingsContainer: {
  flex: 1,
  backgroundColor: "#080816",
  padding: 20,
  alignItems: "center",
},
settingsCard: {
  width: "100%",
  maxWidth: 500,
  backgroundColor: "#14142b",
  borderRadius: 24,
  padding: 20,
  borderWidth: 2,
  borderColor: "#f5c542",
},
settingsTitle: {
  color: "#f5c542",
  fontSize: 30,
  fontWeight: "900",
  textAlign: "center",
  marginBottom: 16,
},
settingsSection: {
  backgroundColor: "#202044",
  borderRadius: 16,
  padding: 14,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "#444466",
},
settingsSectionTitle: {
  color: "#f5c542",
  fontSize: 16,
  fontWeight: "900",
  marginBottom: 8,
},
settingsText: {
  color: "#d7d7ff",
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 4,
},
resetButton: {
  backgroundColor: "#8a2be2",
  borderRadius: 16,
  paddingVertical: 14,
  alignItems: "center",
  marginBottom: 14,
},
resetButtonText: {
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "900",
},
confirmResetBox: {
  backgroundColor: "#2a1630",
  borderRadius: 16,
  padding: 14,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "#ff6b9d",
},
confirmResetText: {
  color: "#ffffff",
  fontSize: 14,
  lineHeight: 20,
  textAlign: "center",
  marginBottom: 12,
},
confirmResetButton: {
  backgroundColor: "#c1121f",
  borderRadius: 14,
  paddingVertical: 12,
  alignItems: "center",
  marginBottom: 10,
},
cancelResetButton: {
  backgroundColor: "#202044",
  borderRadius: 14,
  paddingVertical: 12,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#444466",
},
settingsToggleRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},
settingsToggleButton: {
  minWidth: 72,
  borderRadius: 999,
  paddingVertical: 8,
  alignItems: "center",
  borderWidth: 1,
},
settingsToggleButtonOn: {
  backgroundColor: "#20382a",
  borderColor: "#7CFF9B",
},
settingsToggleButtonOff: {
  backgroundColor: "#33202a",
  borderColor: "#ff6b9d",
},
settingsToggleButtonText: {
  color: "#ffffff",
  fontSize: 13,
  fontWeight: "900",
},
});