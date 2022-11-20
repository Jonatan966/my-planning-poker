import { useState } from "react";
import { GetServerSideProps } from "next";
import * as Sentry from "@sentry/nextjs";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import Table from "../../components/domain/table";
import ConnectionDialog from "../../components/domain/connection-dialog";

import { database } from "../../lib/database";
import { cookieStorageManager } from "../../utils/cookie-storage-manager";
import { persistedCookieVars } from "../../configs/persistent-cookie-vars";
import { errorCodes } from "../../configs/error-codes";

import styles from "../../styles/pages/room.module.css";
import PageHead from "../../components/engine/page-head";
import { appConfig } from "../../configs/app";

interface RoomPageProps {
  basicMe: {
    name?: string;
  };
  roomInfo: {
    id: string;
    name: string;
    created_at: Date;
  };
}

function RoomPage({ basicMe, roomInfo }: RoomPageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
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
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { room_id } = ctx.query;

  try {
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

    return {
      props: {
        basicMe: {
          name: peopleName || null,
        },
        roomInfo: {
          id: room.id,
          name: room.name,
          created_at: room.created_at.toISOString(),
        },
      },
    };
  } catch (error) {
    if (!appConfig.isDevelopment) {
      Sentry.captureException(error);
    }

    return {
      redirect: {
        destination: `/?error=${errorCodes.INTERNAL_ERROR}`,
        permanent: false,
      },
    };
  }
};

export default RoomPage;
