import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHistory } from "react-icons/fa";
import dynamic from "next/dynamic";

import Button from "../components/ui/button";
import { useVisitsStore } from "../stores/visits-store";
import styles from "../styles/pages/home.module.css";
import BackdropLoader from "../components/ui/backdrop-loader";

const RoomCard = dynamic(() => import("../components/domain/room-card"), {
  ssr: false,
});

function VisitsPage() {
  const router = useRouter();

  const { visits, removeVisit } = useVisitsStore((state) => ({
    visits: state.visits,
    removeVisit: state.removeVisit,
  }));

  const [isVisitingRoom, setIsVisitingRoom] = useState(false);

  const parsedVisits = Object.values(visits);

  async function onVisitRoom(roomId: string) {
    setIsVisitingRoom(true);

    try {
      await router.push(`/rooms/${roomId}`);
    } catch {
      toast.error("Não foi possível entrar na sala");
    }

    setIsVisitingRoom(false);
  }

  function renderVisits() {
    if (parsedVisits.length) {
      return parsedVisits.map((room) => (
        <RoomCard
          onRemoveRoom={removeVisit}
          roomInfo={room}
          key={room.id}
          onClick={onVisitRoom}
        />
      ));
    }

    return (
      <span className={styles.withoutVisits}>
        Você não visitou nenhuma sala
      </span>
    );
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

        <div className={styles.visits}>{renderVisits()}</div>
      </section>

      {isVisitingRoom && <BackdropLoader>Entrando na sala...</BackdropLoader>}
    </div>
  );
}

export default VisitsPage;
