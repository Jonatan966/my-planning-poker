import * as Sentry from "@sentry/nextjs";
import { GetServerSideProps } from "next";
import { useState } from "react";

import ConnectionDialog from "../../components/domain/connection-dialog";
import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import Table from "../../components/domain/table";

import { errorCodes } from "../../configs/error-codes";
import { persistedCookieVars } from "../../configs/persistent-cookie-vars";
import { cookieStorageManager } from "../../utils/cookie-storage-manager";

import { InactivityDialog } from "../../components/domain/inactivity-dialog";
import PageHead from "../../components/engine/page-head";
import { appConfig } from "../../configs/app";
import styles from "../../styles/pages/room.module.css";
import { validateRoomId } from "../../utils/validate-room-id";

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
          <InactivityDialog />

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
    const isValidRoomId = validateRoomId(String(room_id));

    if (!isValidRoomId) {
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
          id: room_id,
          name: "Nova Sala",
          created_at: new Date().toISOString(),
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
