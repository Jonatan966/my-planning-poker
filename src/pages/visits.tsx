import classNames from "classnames";
import Link from "next/link";
import { FaHistory } from "react-icons/fa";

import RoomCard from "../components/domain/quick-room-access/room-card";
import ClientOnly from "../components/engine/client-only";
import PageHead from "../components/engine/page-head";
import Button from "../components/ui/button";
import { useVisitsStore } from "../stores/visits-store";

import { DevCredits } from "../components/domain/dev-credits";
import { useRoomAccess } from "../contexts/room-access-context";
import homeStyles from "../styles/pages/home.module.css";
import visitsStyles from "../styles/pages/visits.module.css";

function VisitsPage() {
  const { visits, removeVisit } = useVisitsStore((state) => ({
    visits: Object.values(state.visits),
    removeVisit: state.removeVisit,
  }));

  const { onVisitRoom } = useRoomAccess();

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
      </div>
      <DevCredits />
    </>
  );
}

export default VisitsPage;
