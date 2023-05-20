import classNames from "classnames";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { BsFillSuitClubFill, BsPiggyBankFill } from "react-icons/bs";

import { useConfetti } from "../../../../contexts/confetti-context";
import { ClientRoomEvents } from "../../../../services/room-events";
import { useRoomStore } from "../../../../stores/room-store";

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
    setPeoplesHighlight,
  } = useRoomStore((state) => ({
    showEasterEgg: state.showEasterEgg,
    roomSubscription: state.basicInfo.subscription,
    setEasterEggVisibility: state.setEasterEggVisibility,
    broadcastConfetti: state.broadcastConfetti,
    setPeoplesHighlight: state.setPeoplesHighlight,
  }));

  const easterEggCountdown = useRef(5);

  useEffect(() => {
    if (!roomSubscription) {
      return;
    }

    roomSubscription.bind(
      ClientRoomEvents.PEOPLE_FIRE_CONFETTI,
      ({ people_id }: { people_id: string }) =>
        showEasterEggConfettis(EasterEggMode.PRIVATE, people_id)
    );

    return () => {
      roomSubscription.unbind(ClientRoomEvents.PEOPLE_FIRE_CONFETTI);
    };
  }, [roomSubscription]);

  async function showEasterEggConfettis(
    mode: EasterEggMode = EasterEggMode.PUBLIC,
    sender_id = roomSubscription?.members.myID as string
  ) {
    if (confettiIsFiring.current) {
      setPeoplesHighlight([sender_id]);

      return;
    }

    if (mode === EasterEggMode.PUBLIC && showEasterEgg && roomSubscription) {
      broadcastConfetti();
    }

    setPeoplesHighlight([sender_id], "cyan");

    await fireScatteredConfetti();

    setPeoplesHighlight([sender_id]);
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
