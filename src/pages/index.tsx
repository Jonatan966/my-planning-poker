import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ConnectionForm } from "../components/domain/connection-form";

import { TabMenu } from "../components/ui/tab-menu";
import styles from "../styles/pages/home.module.css";

function HomePage() {
  const [menu, setMenu] = useState("enter");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query?.error === "room_not_exists") {
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
          <h1 translate="no">My Planning Poker</h1>
        </div>
        <TabMenu
          disabled={isLoading}
          menus={[
            {
              id: "enter",
              name: "Entrar",
            },
            {
              id: "create",
              name: "Criar",
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
