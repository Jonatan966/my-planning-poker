import Link from "next/link";
import { useRouter } from "next/router";
import { FaHistory } from "react-icons/fa";
import dynamic from "next/dynamic";

import Button from "../components/ui/button";
import { useVisitsStore } from "../stores/visits-store";
import styles from "../styles/pages/home.module.css";

const RoomCard = dynamic(() => import("../components/domain/room-card"), {
  ssr: false,
});

function VisitsPage() {
  const router = useRouter();

  const { visits, removeVisit } = useVisitsStore((state) => ({
    visits: state.visits,
    removeVisit: state.removeVisit,
  }));

  const parsedVisits = Object.values(visits);

  function onVisitRoom(roomId: string) {
    router.push(`/rooms/${roomId}`);
  }

  return (
    <div className={styles.container}>
      <section className={styles.contentBox}>
        <div className={styles.appName}>
          <FaHistory size={32} />
          <h1 translate="no">Minhas visitas</h1>

          <div className={styles.menu}>
            <Link href="/">
              <Button colorScheme="danger">Voltar</Button>
            </Link>
          </div>
        </div>

        <div className={styles.visits}>
          {parsedVisits.map((room) => (
            <RoomCard
              onRemoveRoom={removeVisit}
              roomInfo={room}
              key={room.id}
              onClick={onVisitRoom}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default VisitsPage;
