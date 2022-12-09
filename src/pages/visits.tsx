import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHistory } from "react-icons/fa";

import Button from "../components/ui/button";
import { useVisitsStore } from "../stores/visits-store";
import BackdropLoader from "../components/ui/backdrop-loader";
import ClientOnly from "../components/engine/client-only";
import RoomCard from "../components/domain/quick-room-access/room-card";
import PageHead from "../components/engine/page-head";

import homeStyles from "../styles/pages/home.module.css";
import visitsStyles from "../styles/pages/visits.module.css";
import classNames from "classnames";

function VisitsPage() {
  const router = useRouter();

  const { visits, removeVisit } = useVisitsStore((state) => ({
    visits: Object.values(state.visits),
    removeVisit: state.removeVisit,
  }));

  const [isVisitingRoom, setIsVisitingRoom] = useState(false);

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
    if (visits.length) {
      return visits.map((room) => (
        <RoomCard
          onRemoveRoom={removeVisit}
          roomInfo={room}
          key={room.id}
          onClick={onVisitRoom}
        />
      ));
    }

    return (
      <span className={visitsStyles.withoutVisits}>
        Você não visitou nenhuma sala
      </span>
    );
  }

  return (
    <>
      <PageHead title="Minhas Visitas" />
      <div className={homeStyles.container}>
        <section
          className={classNames(
            homeStyles.contentBox,
            visitsStyles.visitsContentBox
          )}
        >
          <div className={homeStyles.appName}>
            <FaHistory size={32} />
            <h3>Minhas visitas</h3>

            <div className={homeStyles.menu}>
              <Link href="/">
                <Button colorScheme="danger" outlined>
                  Voltar
                </Button>
              </Link>
            </div>
          </div>

          <div className={visitsStyles.visitsList}>
            <ClientOnly>{renderVisits()}</ClientOnly>
          </div>
        </section>

        {isVisitingRoom && (
          <BackdropLoader>Encontrando a sala...</BackdropLoader>
        )}
      </div>
    </>
  );
}

export default VisitsPage;
