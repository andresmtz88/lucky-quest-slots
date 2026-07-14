# Lucky Quest Slots

A cross-platform mobile slot game built with React Native, Expo, and TypeScript.

Lucky Quest Slots is a free-to-play social casino project focused on progression, objectives, rewards, persistent local saves, and polished mobile interaction. It does not use real-money gambling or cash-out mechanics.

## Project Status

Active development. The current build includes two playable slot themes and the core progression, reward, save, and settings systems.

## Current Slot Themes

- **Neon Dragon Fortune** — neon fantasy slot experience with jackpot progression
- **Pirate Moon Jackpot** — pirate-themed slot experience with its own reel set, progress meter, and reward loop
- **Catsino Royale** — planned luxury cat-themed slot experience

## Core Features

- Adjustable bet controls
- Slot reel generation and win evaluation
- Coin balance and payout handling
- Player XP and level progression
- Level-up coin rewards
- Daily and hourly rewards
- Rewarded-ad bonus concept
- Free-spin tokens
- Loss-shield tokens
- Jackpot and themed progress meters
- Objectives and claimable rewards
- Recent-spin and win history
- Sound, music, and vibration settings
- Haptic feedback
- Persistent local save data with AsyncStorage
- Scrollable mobile layouts designed for different screen sizes

## Technical Highlights

### Persistent State

The application stores progression and settings locally with `@react-native-async-storage/async-storage`. Saved data includes coins, player level and XP, settings, jackpot progress, themed progress, win history, token balances, reward cooldowns, and objective claims.

### Progression Systems

Gameplay actions feed connected progression systems, including XP, levels, objectives, token rewards, jackpots, and themed meters. This creates a broader gameplay loop beyond individual spins.

### Iterative Development

The project was built through small, testable milestones. Features were added one system at a time, with working backups and functional testing used to isolate regressions, resolve synchronization issues, and preserve stable builds.

## Technology Stack

- React Native
- Expo
- TypeScript / JavaScript
- Expo Router
- AsyncStorage
- Expo Haptics
- Git and GitHub

## Project Structure

```text
src/
├── app/          # Main application screens and game flow
├── constants/    # Game configuration and progression values
├── utils/        # Reel generation, payout, timing, and XP helpers
└── backups/      # Development checkpoints retained during early builds
```

The `src/backups/` directory contains development snapshots created while the project was being built. Git history will replace this backup approach as the repository is cleaned and prepared for a more production-like structure.

## Getting Started

### Prerequisites

- Node.js
- npm
- Expo Go, an Android emulator, or an iOS simulator

### Installation

```bash
git clone https://github.com/andresmtz88/lucky-quest-slots.git
cd lucky-quest-slots
npm install
```

### Run the App

```bash
npx expo start
```

Additional commands:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

## Product Principles

- Entertainment only — no real-money gambling or cash-out mechanics
- Rewarded ads rather than forced interruptions
- Progression and objectives that reward continued play
- Local-first persistence for the MVP
- Clear settings and user control
- Incremental development with frequent testing

## Current Limitations

- No production deployment or app-store release
- No cloud account system or cross-device sync
- Rewarded-ad flow is a product concept rather than a production ad-network integration
- Audio assets and final visual polish are still in development
- Catsino Royale is planned but not yet implemented

## Planned Improvements

- Complete Catsino Royale
- Replace placeholder audio with production-ready sound and music
- Add automated tests for payout and progression logic
- Refactor the main screen into smaller reusable components
- Remove development backup files after validating Git history
- Add screenshots and gameplay demonstrations
- Prepare Android and iOS release builds

## Security and Privacy

- No user accounts are required in the current MVP
- Save data remains on the local device
- No API keys or private credentials are required to run the current project
- The repository was reviewed with Gitleaks; detected `SAVE_KEY` findings were local-storage identifier false positives, not credentials

## What This Project Demonstrates

- Cross-platform mobile development
- State and persistence design
- Product-oriented feature planning
- Reusable gameplay systems
- Debugging and regression isolation
- Iterative delivery
- Mobile UX refinement

## Author

**Andres Martinez, M.D.**

Physician-trained healthcare operations professional building AI-enabled software, mobile applications, and workflow systems.

- GitHub: [andresmtz88](https://github.com/andresmtz88)
- LinkedIn: [andresmtz88](https://www.linkedin.com/in/andresmtz88/)

## License

This project is maintained as a personal portfolio and learning project. Review the repository license before reuse or redistribution.
