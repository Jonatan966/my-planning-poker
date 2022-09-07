import { useState } from "react";
import { ConnectionForm } from "../components/domain/connection-form";

import { TabMenu } from "../components/ui/tab-menu";
import styles from "../styles/pages/home.module.css";

function HomePage() {
  const [menu, setMenu] = useState("enter");

  return (
    <div className={styles.container}>
      <section className={styles.contentBox}>
        <div className={styles.appName}>
          <img src="/favicon.png" alt="Logotipo da aplicação" />
          <h1>My Planning Poker</h1>
        </div>
        <TabMenu
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

        <ConnectionForm menu={menu} />
      </section>
    </div>
  );
}

export default HomePage;
