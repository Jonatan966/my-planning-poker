import { FaHistory } from "react-icons/fa";
import Button from "../../ui/button";
import { Tooltip } from "../../ui/tooltip";

import { useEffect, useState } from "react";
import { useVisitsStore } from "../../../stores/visits-store";
import styles from "./styles.module.css";

interface LastRoomAccessProps {
  onAccessLastVisitedRoom(room_id: string): void;
  isDisabled?: boolean;
}

export function LastRoomAccess({
  onAccessLastVisitedRoom,
  isDisabled,
}: LastRoomAccessProps) {
  const [isMounted, setIsMounted] = useState(false);

  const { lastVisitedRoomId } = useVisitsStore((state) => ({
    lastVisitedRoomId: state.lastVisitedRoomId,
  }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Tooltip message="Acessar última sala visitada">
      <Button
        type="button"
        outlined
        isShort
        disabled={isDisabled || !isMounted || !lastVisitedRoomId}
        className={styles.history}
        onClick={() => onAccessLastVisitedRoom(lastVisitedRoomId)}
      >
        <FaHistory size={18} />
      </Button>
    </Tooltip>
  );
}
