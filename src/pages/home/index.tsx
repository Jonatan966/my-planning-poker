import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import TextInput from "../../components/text-input";
import { useRoom } from "../../contexts/room-context";
import styles from "./styles.module.css";

function HomePage() {
  const { createRoom, connectOnRoom } = useRoom();
  const [menu, setMenu] = useState("enter");
  const navigate = useNavigate();

  const [peopleName, setPeopleName] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    const newRoomCode = createRoom(newRoomName, peopleName);

    navigate(`/rooms/${newRoomCode}`);
  }

  async function handleEnterOnRoom(event: FormEvent) {
    event.preventDefault();

    await connectOnRoom(roomCode, peopleName);

    navigate(`/rooms/${roomCode}`);
  }

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
        <form className={styles.form} onSubmit={handleEnterOnRoom}>
          <TextInput
            title="Seu nome"
            placeholder="Ex: John Doe"
            onChange={(e) => setPeopleName(e.target.value)}
            value={peopleName}
          />
          <TextInput
            title="Código da sala"
            placeholder="Ex: 4d71a4a3-f191-498d-a160-2de65febcb4e"
            onChange={(e) => setRoomCode(e.target.value)}
            value={roomCode}
          />
          <Button>Entrar na sala</Button>
        </form>
      )}

      {menu === "create" && (
        <form className={styles.form} onSubmit={handleCreateRoom}>
          <TextInput
            title="Seu nome"
            placeholder="Ex: John Doe"
            onChange={(e) => setPeopleName(e.target.value)}
            value={peopleName}
          />
          <TextInput
            placeholder="Ex: Planejamento semanal"
            title="Nome da sala"
            onChange={(e) => setNewRoomName(e.target.value)}
            value={newRoomName}
          />

          <Button>Criar sala</Button>
        </form>
      )}
    </section>
  );
}

export default HomePage;
