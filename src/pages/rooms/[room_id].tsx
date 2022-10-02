import { useState } from "react";
import { randomUUID } from "crypto";
import { GetServerSideProps } from "next";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import Table from "../../components/domain/table";
import ConnectionDialog from "../../components/domain/connection-dialog";

import { database } from "../../lib/database";
import { cookieStorageManager } from "../../utils/cookie-storage-manager";
import { persistedCookieVars } from "../../configs/persistent-cookie-vars";
import { errorCodes } from "../../configs/error-codes";
import { ConfettiProvider } from "../../contexts/confetti-context";

import styles from "../../styles/pages/room.module.css";
import PageHead from "../../components/engine/page-head";

interface RoomPageProps {
  basicMe: {
    id: string;
    name?: string;
  };
  roomInfo: {
    id: string;
    name: string;
    countdown_started_at?: number;
    created_at: Date;
  };
}

function RoomPage({ basicMe, roomInfo }: RoomPageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ConfettiProvider>
      <PageHead title={roomInfo.name} />
      <RoomHeader basicMe={basicMe} roomInfo={roomInfo} />
      <ConnectionDialog
        isOpen={isLoading}
        onRequestClose={() => setIsLoading(false)}
        basicMe={basicMe}
        roomInfo={roomInfo}
      />
      {!isLoading && (
        <>
          <main className={styles.mainConatainer}>
            <Table />
          </main>

          <PointsList />
        </>
      )}
    </ConfettiProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { room_id } = ctx.query;

  const room = await database.room.findUnique({
    where: {
      id: String(room_id),
    },
  });

  if (!room) {
    return {
      redirect: {
        destination: `/?error=${errorCodes.ROOM_NOT_EXISTS}`,
        permanent: false,
      },
    };
  }

  const peopleName = cookieStorageManager.getItem(
    persistedCookieVars.PEOPLE_NAME,
    ctx
  );
  const peopleID = randomUUID();

  if (!cookieStorageManager.getItem(persistedCookieVars.PEOPLE_ID, ctx)) {
    cookieStorageManager.setItem(persistedCookieVars.PEOPLE_ID, peopleID, ctx, {
      httpOnly: true,
    });
  }

  const parsedCountdown = Number(room.countdown_started_at);

  return {
    props: {
      basicMe: {
        id: peopleID,
        name: peopleName || null,
      },
      roomInfo: {
        id: room.id,
        name: room.name,
        countdown_started_at: parsedCountdown,
        created_at: room.created_at.toISOString(),
      },
    },
  };
};

export default RoomPage;
