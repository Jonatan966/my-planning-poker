import classNames from "classnames";
import { useState } from "react";

import Button from "../components/ui/button";
import TextInput from "../components/ui/text-input";
import usePersistedState from "../hooks/use-persisted-state";
import styles from "../styles/pages/home.module.css";

function HomePage() {
  const [menu, setMenu] = useState("enter");
  const [peopleName, setPeopleName] = usePersistedState(
    "@planning:people-name",
    ""
  );
  const [newRoomName, setNewRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  return (
    <section className={styles.container}>
      <h1>My Planning Poker</h1>
      <div className={styles.tabOptions}>
        <button
          className={classNames({
            [styles.selected]: menu === "enter",
          })}
          onClick={() => setMenu("enter")}
        >
          Entrar
        </button>
        <button
          className={classNames({
            [styles.selected]: menu === "create",
          })}
          onClick={() => setMenu("create")}
        >
          Criar
        </button>
      </div>

      {menu === "enter" && (
        <form className={styles.form}>
          <TextInput
            title="Seu nome"
            placeholder="Ex: John Doe"
            onChange={(e) => setPeopleName(e.target.value)}
            value={peopleName}
            required
            maxLength={20}
          />
          <TextInput
            title="Código da sala"
            placeholder="Ex: 4d71a4a3-f191-498d-a160-2de65febcb4e"
            onChange={(e) => setRoomCode(e.target.value)}
            value={roomCode}
            required
          />
          <Button>Entrar na sala</Button>
        </form>
      )}

      {menu === "create" && (
        <form className={styles.form}>
          <TextInput
            title="Seu nome"
            placeholder="Ex: John Doe"
            onChange={(e) => setPeopleName(e.target.value)}
            value={peopleName}
            required
            maxLength={20}
          />
          <TextInput
            placeholder="Ex: Planejamento semanal"
            title="Nome da sala"
            onChange={(e) => setNewRoomName(e.target.value)}
            value={newRoomName}
            required
            maxLength={32}
          />

          <Button>Criar sala</Button>
        </form>
      )}
    </section>
  );
}

export default HomePage;
