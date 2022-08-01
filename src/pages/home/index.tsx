import { useState } from "react";
import Button from "../../components/button";
import TextInput from "../../components/text-input";
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
          <TextInput title="Seu nome" placeholder="Ex: John Doe" />
          <TextInput
            title="Código da sala"
            placeholder="Ex: 4d71a4a3-f191-498d-a160-2de65febcb4e"
          />
          <Button>Entrar na sala</Button>
        </form>
      )}

      {menu === "create" && (
        <form className={styles.form}>
          <TextInput title="Seu nome" placeholder="Ex: John Doe" />
          <TextInput
            placeholder="Ex: Planejamento semanal"
            title="Nome da sala"
          />

          <Button>Criar sala</Button>
        </form>
      )}
    </section>
  );
}

export default HomePage;
