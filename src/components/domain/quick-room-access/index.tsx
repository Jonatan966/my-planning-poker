import Link from "next/link";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useRoomAccess } from "../../../contexts/room-access-context";
import { useVisitsStore } from "../../../stores/visits-store";
import { Tooltip } from "../../ui/tooltip";
import RoomCard from "./room-card";

import styles from "./styles.module.css";

export function QuickRoomAccess() {
  const [isMounted, setIsMounted] = useState(false);
  const { lastVisitedRoom, removeVisit } = useVisitsStore((state) => ({
    lastVisitedRoom: state.lastVisitedRoom,
    removeVisit: state.removeVisit,
  }));
  const { onVisitRoom } = useRoomAccess();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function renderContent() {
    if (isMounted && lastVisitedRoom) {
      return (
        <RoomCard
          onRemoveRoom={removeVisit}
          roomInfo={lastVisitedRoom}
          onClick={onVisitRoom}
        />
      );
    }

    return <span>Visite uma sala e ela aparecerá aqui</span>;
  }

  return (
    <>
      <label className={styles.quickRoomAccessLabel}>
        <div className={styles.quickRoomAccessTitle}>
          <span>Acesso rápido</span>
          <Tooltip
            message={
              <>
                Acesse rápidamente a última sala visitada, <br /> ou veja um
                histórico com todas as suas visitas
              </>
            }
            wrapperClassName={styles.helpIcon}
          >
            <FaInfoCircle size={15} />
          </Tooltip>
        </div>
        <Link href="/visits">Ver mais</Link>
      </label>

      <div className={styles.quickRoomAccessContainer}>{renderContent()}</div>
    </>
  );
}
