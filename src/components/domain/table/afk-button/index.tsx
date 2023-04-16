import { BsBellFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";

import Button from "../../../ui/button";
import { useRoomStore } from "../../../../stores/room-store";
import { ClientRoomEvents } from "../../../../services/room-events";
import { useAfkAlert } from "../../../../contexts/afk-alert-context";

interface AfkButtonProps {
  countOfPeoplesWithPoints: number;
  meSelectedPoints: boolean;
}

const FIVE_SECONDS = 5000;
const TEN_SECONDS = 10000;

export function AfkButton({
  countOfPeoplesWithPoints,
  meSelectedPoints,
}: AfkButtonProps) {
  const { playAlert } = useAfkAlert();

  const [alertIsInCooldown, setAlertIsInCooldown] = useState(false);
  const [showAFKButton, setAFKButtonVisibility] = useState(false);

  const { broadcastAfkAlert, showPoints, roomSubscription, countOfPeoples } =
    useRoomStore((state) => ({
      broadcastAfkAlert: state.broadcastAfkAlert,
      showPoints: state.basicInfo.showPoints,
      roomSubscription: state.basicInfo.subscription,
      countOfPeoples: Object.keys(state.peoples).length,
    }));

  const alertCooldownTimer = useRef(-1);
  const afkDebounceTimer = useRef({
    timerRef: -1,
    countOfPeoplesWithPoints: 0,
  });

  useEffect(() => {
    const everyoneButMeSelectPoints =
      countOfPeoplesWithPoints === countOfPeoples - 1 && !meSelectedPoints;
    const everyoneSelectPoints = countOfPeoplesWithPoints === countOfPeoples;

    if (everyoneButMeSelectPoints || everyoneSelectPoints) {
      clearTimeout(afkDebounceTimer.current.timerRef);
      setAFKButtonVisibility(false);
      return;
    }

    if (
      countOfPeoplesWithPoints !==
      afkDebounceTimer.current.countOfPeoplesWithPoints
    ) {
      clearTimeout(afkDebounceTimer.current.timerRef);

      afkDebounceTimer.current.countOfPeoplesWithPoints =
        countOfPeoplesWithPoints;

      afkDebounceTimer.current.timerRef = Number(
        setTimeout(() => setAFKButtonVisibility(true), FIVE_SECONDS)
      );
    }
  }, [countOfPeoplesWithPoints, countOfPeoples, meSelectedPoints]);

  useEffect(() => {
    afkDebounceTimer.current.countOfPeoplesWithPoints = 0;
  }, [showPoints]);

  useEffect(() => {
    if (!roomSubscription) return;

    function _showAfkAlert(_: { people_id: string }) {
      playAlert();
      _enableCooldown();
    }

    roomSubscription.bind(ClientRoomEvents.ROOM_SHOW_AFK_ALERT, _showAfkAlert);

    return () => {
      clearTimeout(alertCooldownTimer.current);
      setAlertIsInCooldown(false);
      roomSubscription.unbind(ClientRoomEvents.ROOM_SHOW_AFK_ALERT);
    };
  }, [roomSubscription]);

  function _enableCooldown() {
    setAlertIsInCooldown(true);

    alertCooldownTimer.current = Number(
      setTimeout(() => setAlertIsInCooldown(false), TEN_SECONDS)
    );
  }

  function handleBroadcastAfkAlert() {
    _enableCooldown();
    broadcastAfkAlert();
  }

  return (
    <Button
      isShort
      colorScheme="primary"
      outlined
      onClick={handleBroadcastAfkAlert}
      disabled={!showAFKButton || alertIsInCooldown}
    >
      <BsBellFill size={14} />
    </Button>
  );
}
