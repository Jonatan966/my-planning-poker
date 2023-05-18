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
    hasMeWithoutPoints,
    roomSubscription,
    countOfPeoples,
    peoples,
    hasPeopleWithPoints,
    myID,
  } = useRoomStore((state) => ({
    broadcastAfkAlert: state.broadcastAfkAlert,
    highlightAfkPeoples: state.highlightAfkPeoples,
    hasMeWithoutPoints: state.hasMeWithoutPoints,
    roomSubscription: state.basicInfo.subscription,
    countOfPeoples: Object.keys(state.peoples).length,
    peoples: state.peoples,
    hasPeopleWithPoints: state.hasPeopleWithPoints,
    myID: state.basicInfo.subscription?.members?.myID,
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

    roomSubscription.bind(ClientRoomEvents.ROOM_SHOW_AFK_ALERT, () =>
      onShowAFKAlert({ play: hasMeWithoutPoints() })
    );

    return () => {
      roomSubscription.unbind(ClientRoomEvents.ROOM_SHOW_AFK_ALERT);
    };
  }, [roomSubscription]);

  useEffect(() => {
    if (!hasPeopleWithPoints) {
      return;
    }

    const { peoplesButMeWithPoints, peoplesWithPoints } = Object.values(
      peoples
    ).reduce(
      (acc, people) => {
        if (typeof people?.points === "undefined") {
          return acc;
        }

        acc.peoplesWithPoints += 1;

        if (people.id !== myID) {
          acc.peoplesButMeWithPoints += 1;
        }

        return acc;
      },
      { peoplesWithPoints: 0, peoplesButMeWithPoints: 0 }
    );

    if (
      countOfPeoples - 1 === peoplesButMeWithPoints ||
      countOfPeoples === peoplesWithPoints
    ) {
      clearTimeout(enableAFKButtonTimer.current);
      setCurrentAFKButtonState(AFKButtonState.DISABLED);
      return;
    }

    if (currentAFKButtonState !== AFKButtonState.DISABLED) {
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
