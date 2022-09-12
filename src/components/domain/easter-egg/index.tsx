import { useRef, useCallback, useEffect } from "react";
import ReactConfetti from "react-canvas-confetti";
import { useEasterEggStore } from "../../../stores/easter-egg-store";

import styles from "./styles.module.css";

function EasterEgg() {
  const { easterEggCountdown } = useEasterEggStore((state) => ({
    easterEggCountdown: state.easterEggCountdown,
  }));

  const refAnimationInstance = useRef<confetti.CreateTypes>(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  async function showConfettis() {
    for (let confettiCount = 12; confettiCount > 0; confettiCount--) {
      const randomDelay = 450 + Math.random() * 250;

      await new Promise((resolve) => setTimeout(resolve, randomDelay));

      refAnimationInstance.current({
        origin: {
          x: Math.random(),
          y: Math.random() + 0.1,
        },
        particleCount: 250,
        spread: 100,
        colors: ["#00B7AB"],
      });
    }
  }

  useEffect(() => {
    if (easterEggCountdown <= 0) {
      showConfettis();
    }
  }, [easterEggCountdown]);

  return (
    <ReactConfetti refConfetti={getInstance} className={styles.confetti} />
  );
}

export { EasterEgg };
