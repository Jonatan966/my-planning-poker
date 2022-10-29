import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHistory, FaNewspaper } from "react-icons/fa";
import { ConnectionForm } from "../components/domain/connection-form";
import Button from "../components/ui/button";

import { TabMenu } from "../components/ui/tab-menu";
import { errorCodes } from "../configs/error-codes";
import styles from "../styles/pages/home.module.css";

function HomePage() {
  const [menu, setMenu] = useState("enter");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query?.error === errorCodes.ROOM_NOT_EXISTS) {
      toast.error("Não existe uma sala com esse código");
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
            <Button colorScheme="secondary" title="Changelog" disabled>
              <FaNewspaper size={18} />
            </Button>

            <Link href="/visits">
              <Button colorScheme="secondary" title="Minhas visitas">
                <FaHistory size={18} />
              </Button>
            </Link>
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
        />

        <ConnectionForm
          menu={menu}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}

export default HomePage;
