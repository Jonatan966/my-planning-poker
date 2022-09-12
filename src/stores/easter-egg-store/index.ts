import toast from "react-hot-toast";
import createStore, { StateCreator } from "zustand";

interface EasterEggStoreProps {
  callEasterEgg(): void;
  easterEggCountdown: number;
}

const easterEggStore: StateCreator<EasterEggStoreProps> = (set, get) => {
  function callEasterEgg() {
    const currentCountdown = get().easterEggCountdown;

    if (currentCountdown <= 0) {
      return;
    }

    if (currentCountdown === 1) {
      toast("🐷🏅💻📱💸");
    } else {
      toast(new Array(currentCountdown).fill("🐽").join(" "));
    }

    set({
      easterEggCountdown: currentCountdown - 1,
    });
  }

  return {
    easterEggCountdown: 5,
    callEasterEgg,
  };
};

export const useEasterEggStore =
  createStore<EasterEggStoreProps>(easterEggStore);
