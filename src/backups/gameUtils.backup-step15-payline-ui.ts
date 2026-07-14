// @ts-nocheck
import { NEON_DRAGON_SYMBOLS } from "../constants/gameConfig";

export function getRandomSymbol() {
  const randomIndex = Math.floor(Math.random() * NEON_DRAGON_SYMBOLS.length);
  return NEON_DRAGON_SYMBOLS[randomIndex];
}

export function createRandomReels() {
  const newReels: string[][] = [];

  for (let reelIndex = 0; reelIndex < 5; reelIndex++) {
    const reel: string[] = [];

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      reel.push(getRandomSymbol());
    }

    newReels.push(reel);
  }

  return newReels;
}

export function calculateMiddleRowWin(newReels: string[][], betAmount: number) {
  const middleRowSymbols = newReels.map((reel) => reel[1]);
  const firstSymbol = middleRowSymbols[0];

  let leftToRightMatchCount = 1;

  for (let index = 1; index < middleRowSymbols.length; index++) {
    if (middleRowSymbols[index] === firstSymbol) {
      leftToRightMatchCount++;
    } else {
      break;
    }
  }

  if (leftToRightMatchCount >= 5) {
    return betAmount * 50;
  }

  if (leftToRightMatchCount === 4) {
    return betAmount * 15;
  }

  if (leftToRightMatchCount === 3) {
    return betAmount * 5;
  }

  return 0;
}

export function formatTimeRemaining(milliseconds: number) {
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