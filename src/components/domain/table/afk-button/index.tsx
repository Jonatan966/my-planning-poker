import { BsBellFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";

import Button from "../../../ui/button";
import { useRoomStore } from "../../../../stores/room-store";
import { ClientRoomEvents } from "../../../../services/room-events";
import { useAfkAlert } from "../../../../contexts/afk-alert-context";

const FIVE_SECONDS = 5000;

export function AfkButton() {
  const { playAlert } = useAfkAlert();

  const [isAFKButtonCooldown, setIsAFKButtonCooldown] = useState(false);
  const [isAFKButtonDisabled, setIsAFKButtonDisabled] = useState(true);

  const {
    broadcastAfkAlert,
    showPoints,
    roomSubscription,
    countOfPeoples,
    peoples,
    room,
    myID,
    hasPeopleWithPoints,
  } = useRoomStore((state) => ({
    broadcastAfkAlert: state.broadcastAfkAlert,
    showPoints: state.basicInfo.showPoints,
    roomSubscription: state.basicInfo.subscription,
    countOfPeoples: Object.keys(state.peoples).length,
    room: state.basicInfo,
    peoples: state.peoples,
    myID: state.basicInfo?.subscription?.members?.myID,
    hasPeopleWithPoints: state.hasPeopleWithPoints,
  }));

  const enableAFKButtonTimer = useRef(-1);

  useEffect(() => {
    roomSubscription.bind(ClientRoomEvents.ROOM_SHOW_AFK_ALERT, onShowAFKAlert);

    return () => {
      roomSubscription.unbind(ClientRoomEvents.ROOM_SHOW_AFK_ALERT);
    };
  }, [roomSubscription]);

  useEffect(() => {
    if (
      !hasPeopleWithPoints ||
      isAFKButtonCooldown ||
      enableAFKButtonTimer.current !== -1
    ) {
      return;
    }

    const countOfPeoplesWithPoints = Object.values(peoples).filter(
      (people) => typeof people?.points !== "undefined"
    ).length;

    const allPeoplesSelectedPoints =
      countOfPeoplesWithPoints === countOfPeoples;

    if (allPeoplesSelectedPoints) {
      return;
    }

    enableAFKButtonTimer.current = Number(
      setTimeout(() => {
        setIsAFKButtonDisabled(false);
        enableAFKButtonTimer.current = -1;
      }, FIVE_SECONDS)
    );
  }, [hasPeopleWithPoints, peoples, isAFKButtonCooldown]);

  function handleEmitAFKAlert() {
    broadcastAfkAlert();
    onShowAFKAlert({ play: false });
  }

  function onShowAFKAlert({ play = true }) {
    if (play) {
      playAlert();
    }

    setIsAFKButtonDisabled(true);
    setIsAFKButtonCooldown(true);

    enableAFKButtonTimer.current = Number(
      setTimeout(() => {
        setIsAFKButtonCooldown(false);
        enableAFKButtonTimer.current = -1;
      }, FIVE_SECONDS)
    );
  }

  return (
    <Button
      isShort
      colorScheme="primary"
      outlined
      disabled={isAFKButtonDisabled}
      onClick={handleEmitAFKAlert}
    >
      <BsBellFill size={14} />
    </Button>
  );
}
