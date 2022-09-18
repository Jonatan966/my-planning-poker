import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsFillSuitClubFill, BsPiggyBankFill } from "react-icons/bs";
import { useConfetti } from "../../../../contexts/confetti-context";
import { MainRoomEvents, useRoomStore } from "../../../../stores/room-store";

import styles from "./styles.module.css";

enum EasterEggMode {
  PRIVATE,
  PUBLIC,
}

function RoomLogo() {
  const { showConfetti } = useConfetti();
  const { showEasterEgg, roomSubscription, setEasterEggVisibility } =
    useRoomStore((state) => ({
      showEasterEgg: state.showEasterEgg,
      setEasterEggVisibility: state.setEasterEggVisibility,
      roomSubscription: state.basicInfo.subscription,
    }));

  const [confettiIsFiring, setConfettiIsFiring] = useState(false);

  const easterEggCountdown = useRef(5);

  useEffect(() => {
    if (!roomSubscription) {
      return;
    }

    roomSubscription.bind(MainRoomEvents.FIRE_CONFETTI, () =>
      showEasterEggConfettis(EasterEggMode.PRIVATE)
    );

    return () => {
      roomSubscription.unbind(MainRoomEvents.FIRE_CONFETTI);
    };
  }, [roomSubscription]);

  async function showEasterEggConfettis(
    mode: EasterEggMode = EasterEggMode.PUBLIC
  ) {
    if (confettiIsFiring) {
      return;
    }

    setConfettiIsFiring(true);

    if (mode === EasterEggMode.PUBLIC && showEasterEgg && roomSubscription) {
      roomSubscription.trigger(MainRoomEvents.FIRE_CONFETTI, {});
    }

    for (let confettiCount = 12; confettiCount > 0; confettiCount--) {
      showConfetti.current({
        origin: {
          x: Math.random(),
          y: Math.random() + 0.1,
        },
        particleCount: 250,
        spread: 100,
        colors: ["#00B7AB"],
      });

      const randomDelay = 450 + Math.random() * 250;
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
    }

    setConfettiIsFiring(false);
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
        className={classNames(styles.easterIcon, {
          [styles.easterFiring]: confettiIsFiring,
        })}
        onClick={() => showEasterEggConfettis()}
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
