import classNames from "classnames";
import { useEffect, useRef } from "react";
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
  const { confettiIsFiring, fireScatteredConfetti } = useConfetti();
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
    if (confettiIsFiring.current) {
      setPeopleHighlight(sender_id, false);

      return;
    }

    if (mode === EasterEggMode.PUBLIC && showEasterEgg && roomSubscription) {
      broadcastConfetti();
    }

    setPeopleHighlight(sender_id, true);

    await fireScatteredConfetti();

    setPeopleHighlight(sender_id, false);
  }

  function enableEasterEgg() {
    if (confettiIsFiring.current) {
      return;
    }

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
          [styles.easterFiring]: confettiIsFiring.current,
        })}
        onClick={() => showEasterEggConfettis()}
      />
    );
  }

  return (
    <BsFillSuitClubFill
      size={28}
      className={classNames(styles.normalIcon, {
        [styles.easterFiring]: confettiIsFiring.current,
      })}
      onClick={enableEasterEgg}
    />
  );
}

export { RoomLogo };