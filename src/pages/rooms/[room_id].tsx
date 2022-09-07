import { useState } from "react";
import { randomUUID } from "crypto";
import { GetServerSideProps } from "next";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import Table from "../../components/domain/table";
import ConnectionDialog from "../../components/domain/connection-dialog";

import { cookieStorageManager } from "../../utils/cookie-storage-manager";
import { persistedCookieVars } from "../../configs/persistent-cookie-vars";
import styles from "../../styles/pages/room.module.css";
import { redis } from "../../lib/redis";
import { errorCodes } from "../../configs/error-codes";

interface RoomPageProps {
  basicMe: {
    id: string;
    name?: string;
  };
  basicRoomInfo: {
    id: string;
    name: string;
  };
}

function RoomPage({ basicMe, basicRoomInfo }: RoomPageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <RoomHeader basicMe={basicMe} basicRoomInfo={basicRoomInfo} />
      <ConnectionDialog
        isOpen={isLoading}
        onRequestClose={() => setIsLoading(false)}
        basicMe={basicMe}
        basicRoomInfo={basicRoomInfo}
      />
      {!isLoading && (
        <>
          <main className={styles.mainConatainer}>
            <Table />
          </main>

          <PointsList />
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { room_id } = ctx.query;

  const roomName = await redis.get<string>(String(room_id));

  if (!roomName) {
    return {
      redirect: {
        destination: `/?error=${errorCodes.ROOM_NOT_EXISTS}`,
        permanent: false,
      },
    };
  }

  const basicRoomInfo = {
    id: String(room_id),
    name: roomName,
  };

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

  return {
    props: {
      basicMe: {
        id: peopleID,
        name: peopleName || null,
      },
      basicRoomInfo,
    },
  };
};

export default RoomPage;
