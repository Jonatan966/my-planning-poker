import { BsBellFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";

import Button from "../../../ui/button";
import { useRoomStore } from "../../../../stores/room-store";
import { ClientRoomEvents } from "../../../../services/room-events";
import { useAfkAlert } from "../../../../contexts/afk-alert-context";

const FIVE_SECONDS = 5000;

enum AFKButtonState {
  ENABLED,
  DISABLED,
  COOLDOWN,
}

export function AfkButton() {
  const { playAlert, isPlayingAlert } = useAfkAlert();

  const [currentAFKButtonState, setCurrentAFKButtonState] = useState(
    AFKButtonState.DISABLED
  );

  const {
    broadcastAfkAlert,
    highlightAfkPeoples,
    roomSubscription,
    countOfPeoples,
    peoples,
    hasPeopleWithPoints,
  } = useRoomStore((state) => ({
    broadcastAfkAlert: state.broadcastAfkAlert,
    highlightAfkPeoples: state.highlightAfkPeoples,
    roomSubscription: state.basicInfo.subscription,
    countOfPeoples: Object.keys(state.peoples).length,
    peoples: state.peoples,
    hasPeopleWithPoints: state.hasPeopleWithPoints,
  }));

  const enableAFKButtonTimer = useRef(-1);

  function cooldownChangeAFKButtonState(state: AFKButtonState) {
    enableAFKButtonTimer.current = Number(
      setTimeout(() => {
        setCurrentAFKButtonState(state);
        enableAFKButtonTimer.current = -1;
      }, FIVE_SECONDS)
    );
  }

  function handleEmitAFKAlert() {
    broadcastAfkAlert();
    onShowAFKAlert({ play: false });
  }

  function onShowAFKAlert({ play = true }) {
    if (play) {
      playAlert();
    }

    highlightAfkPeoples(FIVE_SECONDS);

    setCurrentAFKButtonState(AFKButtonState.COOLDOWN);
    cooldownChangeAFKButtonState(AFKButtonState.DISABLED);
  }

  useEffect(() => {
    if (!roomSubscription) {
      return;
    }

    roomSubscription.bind(ClientRoomEvents.ROOM_SHOW_AFK_ALERT, onShowAFKAlert);

    return () => {
      roomSubscription.unbind(ClientRoomEvents.ROOM_SHOW_AFK_ALERT);
    };
  }, [roomSubscription]);

  useEffect(() => {
    if (
      currentAFKButtonState !== AFKButtonState.DISABLED ||
      !hasPeopleWithPoints
    ) {
      return;
    }

    const countOfPeoplesWithPoints = Object.values(peoples).filter(
      (people) => typeof people?.points !== "undefined"
    ).length;

    const allPeoplesSelectedPoints =
      countOfPeoplesWithPoints === countOfPeoples;

    if (allPeoplesSelectedPoints) {
      clearTimeout(enableAFKButtonTimer.current);
      return;
    }

    cooldownChangeAFKButtonState(AFKButtonState.ENABLED);
  }, [hasPeopleWithPoints, peoples, currentAFKButtonState]);

  return (
    <Button
      isShort
      colorScheme="primary"
      outlined
      disabled={
        isPlayingAlert || currentAFKButtonState !== AFKButtonState.ENABLED
      }
      onClick={handleEmitAFKAlert}
    >
      <BsBellFill size={14} />
    </Button>
  );
}
