import { useState } from "react";
import styles from "./styles.module.css";

function HomePage() {
  const [menu, setMenu] = useState("enter");

  return (
    <section className={styles.container}>
      <h1>My Planning Poker</h1>
      <div className={styles.tabOptions}>
        <button
          className={menu === "enter" ? styles.selected : ""}
          onClick={() => setMenu("enter")}
        >
          Entrar
        </button>
        <button
          className={menu === "create" ? styles.selected : ""}
          onClick={() => setMenu("create")}
        >
          Criar
        </button>
      </div>

      {menu === "enter" && (
        <form className={styles.form}>
          <label>Nome da sala</label>
          <input type="text" placeholder="Ex: Planejamento semanal" />

          <label>Seu nome</label>
          <input type="text" placeholder="Ex: Jonh Doe" />

          <button>Criar sala</button>
        </form>
      )}

      {menu === "create" && (
        <form className={styles.form}>
          <label>Nome da sala</label>
          <input type="text" placeholder="Ex: Planejamento semanal" />

          <label>Seu nome</label>
          <input type="text" placeholder="Ex: Jonh Doe" />

          <label>Código da sala</label>
          <input
            type="text"
            placeholder="Ex: 4d71a4a3-f191-498d-a160-2de65febcb4e"
          />
          <button>Entrar na sala</button>
        </form>
      )}
    </section>
  );
}

export default HomePage;
