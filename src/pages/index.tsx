import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaNewspaper, FaInfoCircle } from "react-icons/fa";
import { ConnectionForm } from "../components/domain/connection-form";
import { FeedbackDialog } from "../components/domain/feedback-dialog";
import { QuickRoomAccess } from "../components/domain/quick-room-access";
import Button from "../components/ui/button";

import { TabMenu } from "../components/ui/tab-menu";
import { Tooltip } from "../components/ui/tooltip";
import { errorCodes } from "../configs/error-codes";
import styles from "../styles/pages/home.module.css";

function HomePage() {
  const [menu, setMenu] = useState("enter");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    switch (router.query?.error) {
      case errorCodes.ROOM_NOT_EXISTS:
        toast.error("Não existe uma sala com esse código");
        break;

      case errorCodes.INTERNAL_ERROR:
        toast.error("Ocorreu um problema interno ao tentar entrar nessa sala");
        break;
    }
  }, [router.query]);

  useEffect(() => {
    setIsLoading(!router.isReady);
  }, [router.isReady]);

  return (
    <div className={styles.container}>
      <section className={styles.contentBox}>
        <div className={styles.appName}>
          <img src="/favicon.png" alt="Logotipo da aplicação" />
          <h3 translate="no">My Planning Poker</h3>

          <div className={styles.menu}>
            <FeedbackDialog />

            <Button colorScheme="secondary" title="Changelog" disabled>
              <FaNewspaper size={18} />
            </Button>
          </div>
        </div>

        <TabMenu
          disabled={isLoading}
          menus={[
            {
              id: "enter",
              name: "Entrar na sala",
            },
            {
              id: "create",
              name: "Criar sala",
            },
          ]}
          selectedMenu={menu}
          setSelectedMenu={setMenu}
        >
          <Tooltip message="Entre em uma sala existente ou crie uma nova">
            <FaInfoCircle size={20} />
          </Tooltip>
        </TabMenu>
        <ConnectionForm
          menu={menu}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        >
          <QuickRoomAccess />
        </ConnectionForm>
      </section>
    </div>
  );
}

export default HomePage;
