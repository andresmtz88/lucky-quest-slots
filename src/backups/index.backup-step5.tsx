// @ts-nocheck
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Screen = "welcome" | "lobby" | "neonDragon";

export default function HomeScreen() {
  const [screen, setScreen] = useState<Screen>("welcome");

  if (screen === "lobby") {
    return (
      <LobbyScreen
        onBack={() => setScreen("welcome")}
        onOpenNeonDragon={() => setScreen("neonDragon")}
      />
    );
  }

  if (screen === "neonDragon") {
    return <NeonDragonScreen onBack={() => setScreen("lobby")} />;
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
  onBack,
  onOpenNeonDragon,
}: {
  onBack: () => void;
  onOpenNeonDragon: () => void;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lobbyHeader}>
        <Text style={styles.smallLogo}>ðŸŽ° Lucky Quest Slots</Text>
        <Text style={styles.coinBalance}>ðŸª™ 10,000 Coins</Text>
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

function NeonDragonScreen({ onBack }: { onBack: () => void }) {
  const startingReels = [
    ["ðŸ‰", "ðŸª™", "ðŸ’Ž"],
    ["ðŸ”¥", "ðŸ¥š", "ðŸ®"],
    ["7ï¸âƒ£", "ðŸŸ©", "ðŸ‰"],
    ["ðŸ’Ž", "ðŸ”¥", "ðŸª™"],
    ["ðŸ®", "7ï¸âƒ£", "ðŸ¥š"],
  ];

  return (
    <SafeAreaView style={styles.slotContainer}>
      <View style={styles.slotHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerLink}>â† Lobby</Text>
        </TouchableOpacity>

        <Text style={styles.headerCoins}>ðŸª™ 10,000</Text>
      </View>

      <Text style={styles.machineTitle}>ðŸ‰ Neon Dragon Fortune</Text>

      <Text style={styles.machineSubtitle}>
        Vegas neon meets dragon treasure.
      </Text>

      <View style={styles.reelBoard}>
        {startingReels.map((reel, reelIndex) => (
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
        <Text style={styles.betText}>Bet: 100 coins</Text>
        <Text style={styles.resultText}>Ready to spin.</Text>
      </View>

      <TouchableOpacity style={styles.spinButton}>
        <Text style={styles.spinButtonText}>SPIN</Text>
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