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
  const {
    showEasterEgg,
    roomSubscription,
    setEasterEggVisibility,
    broadcastConfetti,
    setPeopleHighlight,
  } = useRoomStore((state) => ({
    showEasterEgg: state.showEasterEgg,
    roomSubscription: state.basicInfo.subscription,
    setEasterEggVisibility: state.setEasterEggVisibility,
    broadcastConfetti: state.broadcastConfetti,
    setPeopleHighlight: state.setPeopleHighlight,
  }));

  const [confettiIsFiring, setConfettiIsFiring] = useState(false);

  const easterEggCountdown = useRef(5);

  useEffect(() => {
    if (!roomSubscription) {
      return;
    }

    roomSubscription.bind(
      MainRoomEvents.FIRE_CONFETTI,
      ({ sender_id }: { sender_id: string }) =>
        showEasterEggConfettis(EasterEggMode.PRIVATE, sender_id)
    );

    return () => {
      roomSubscription.unbind(MainRoomEvents.FIRE_CONFETTI);
    };
  }, [roomSubscription]);

  async function showEasterEggConfettis(
    mode: EasterEggMode = EasterEggMode.PUBLIC,
    sender_id = roomSubscription?.members.myID
  ) {
    if (confettiIsFiring) {
      return;
    }

    setConfettiIsFiring(true);

    if (mode === EasterEggMode.PUBLIC && showEasterEgg && roomSubscription) {
      broadcastConfetti();
    }

    setPeopleHighlight(sender_id, true);

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

    setPeopleHighlight(sender_id, false);
  }

  function enableEasterEgg() {
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
      className={classNames(styles.normalIcon, {
        [styles.easterFiring]: confettiIsFiring,
      })}
      onClick={enableEasterEgg}
    />
  );
}

export { RoomLogo };
