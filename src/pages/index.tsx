import classNames from "classnames";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

import Button from "../components/ui/button";
import TextInput from "../components/ui/text-input";
import { useRoom } from "../contexts/room-context";
import usePersistedState from "../hooks/use-persisted-state";
import styles from "../styles/pages/home.module.css";

function HomePage() {
  const { createRoom, isReady } = useRoom();
  const [menu, setMenu] = useState("enter");
  const router = useRouter();
  const [peopleName, setPeopleName] = usePersistedState(
    "@planning:people-name",
    ""
  );
  const [newRoomName, setNewRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    const newRoomCode = createRoom(newRoomName, peopleName);

    router.push(`/rooms/${newRoomCode}`);
  }

  async function handleEnterOnRoom(event: FormEvent) {
    event.preventDefault();
    router.push(`/rooms/${roomCode}`);
  }

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
        <form className={styles.form} onSubmit={handleEnterOnRoom}>
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
          <Button disabled={!isReady}>Entrar na sala</Button>
        </form>
      )}

      {menu === "create" && (
        <form className={styles.form} onSubmit={handleCreateRoom}>
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

          <Button disabled={!isReady}>Criar sala</Button>
        </form>
      )}
    </section>
  );
}

export default HomePage;
