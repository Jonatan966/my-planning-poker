import { BsBellFill } from "react-icons/bs";
import Button from "../../../ui/button";
import { useEffect, useRef } from "react";
import { useRoomStore } from "../../../../stores/room-store";

interface AfkButtonProps {
  countOfPeoplesWithPoints: number;
}

const FIVE_SECONDS = 5000;

export function AfkButton({ countOfPeoplesWithPoints }: AfkButtonProps) {
  const { setAFKButtonVisible, showPoints } = useRoomStore((state) => ({
    setAFKButtonVisible: state.setAFKButtonVisible,
    showPoints: state.basicInfo.showPoints,
  }));

  const afkDebounceTimer = useRef({
    timerRef: -1,
    countOfPeoplesWithPoints: 0,
  });

  useEffect(() => {
    if (
      countOfPeoplesWithPoints !==
      afkDebounceTimer.current.countOfPeoplesWithPoints
    ) {
      clearTimeout(afkDebounceTimer.current.timerRef);

      afkDebounceTimer.current.countOfPeoplesWithPoints =
        countOfPeoplesWithPoints;

      afkDebounceTimer.current.timerRef = Number(
        setTimeout(setAFKButtonVisible, FIVE_SECONDS)
      );
    }
  }, [countOfPeoplesWithPoints]);

  useEffect(() => {
    afkDebounceTimer.current.countOfPeoplesWithPoints = 0;
  }, [showPoints]);

  return (
    <Button isShort colorScheme="primary" outlined>
      <BsBellFill size={14} />
    </Button>
  );
}
