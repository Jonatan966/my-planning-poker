import Link from "next/link";
import { useEffect, useState } from "react";
import { useVisitsStore } from "../../../stores/visits-store";
import RoomCard from "./room-card";

import styles from "./styles.module.css";

export function QuickRoomAccess() {
  const [isMounted, setIsMounted] = useState(false);
  const { lastVisitedRoom, removeVisit } = useVisitsStore((state) => ({
    lastVisitedRoom: state.lastVisitedRoom,
    removeVisit: state.removeVisit,
  }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function renderContent() {
    if (isMounted && lastVisitedRoom) {
      return <RoomCard onRemoveRoom={removeVisit} roomInfo={lastVisitedRoom} />;
    }

    return <span>Visite uma sala e ela aparecerá aqui</span>;
  }

  return (
    <>
      <label className={styles.quickRoomAccessLabel}>
        <span>Última visita</span>
        <Link href="/visits">Ver mais</Link>
      </label>

      <div className={styles.quickRoomAccessContainer}>{renderContent()}</div>
    </>
  );
}
