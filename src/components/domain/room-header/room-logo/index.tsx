import { useRef } from "react";
import toast from "react-hot-toast";
import { BsFillSuitClubFill, BsPiggyBankFill } from "react-icons/bs";
import { useConfetti } from "../../../../contexts/confetti-context";
import { useRoomStore } from "../../../../stores/room-store";

import styles from "./styles.module.css";

function RoomLogo() {
  const { showConfetti } = useConfetti();
  const { showEasterEgg, setEasterEggVisibility } = useRoomStore((state) => ({
    showEasterEgg: state.showEasterEgg,
    setEasterEggVisibility: state.setEasterEggVisibility,
  }));

  const easterEggCountdown = useRef(5);

  async function showEasterEggConfettis() {
    for (let confettiCount = 12; confettiCount > 0; confettiCount--) {
      const randomDelay = 450 + Math.random() * 250;

      await new Promise((resolve) => setTimeout(resolve, randomDelay));

      showConfetti.current({
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

  function callEasterEgg() {
    const currentCountdown = easterEggCountdown.current;

    if (currentCountdown <= 0) {
      return;
    }

    if (currentCountdown === 1) {
      toast("🐷🏅💻📱💸");
      setEasterEggVisibility(true);
      showEasterEggConfettis();
    } else {
      toast(new Array(currentCountdown).fill("🐽").join(" "));
    }

    easterEggCountdown.current = currentCountdown - 1;
  }

  if (showEasterEgg) {
    return (
      <BsPiggyBankFill
        size={28}
        color="#00B7AB"
        className={styles.easterIcon}
      />
    );
  }

  return (
    <BsFillSuitClubFill
      size={28}
      className={styles.normalIcon}
      onClick={callEasterEgg}
    />
  );
}

export { RoomLogo };
