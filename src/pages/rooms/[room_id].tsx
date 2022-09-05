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

interface RoomPageProps {
  basicMe: {
    id: string;
    name?: string;
  };
}

function RoomPage({ basicMe }: RoomPageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <RoomHeader basicMe={basicMe} />
      <ConnectionDialog
        isOpen={isLoading}
        onRequestClose={() => setIsLoading(false)}
        basicMe={basicMe}
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
  const peopleName = cookieStorageManager.getItem(
    persistedCookieVars.PEOPLE_NAME,
    ctx
  );
  const peopleID = randomUUID();

  cookieStorageManager.setItem(persistedCookieVars.PEOPLE_ID, peopleID, ctx, {
    httpOnly: true,
  });

  return {
    props: {
      basicMe: {
        id: peopleID,
        name: peopleName || null,
      },
    },
  };
};

export default RoomPage;
