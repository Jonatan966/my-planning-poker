import { useRouter } from "next/router";
import { useState, FormEvent } from "react";
import { useRoom } from "../../../contexts/room-context";
import usePersistedState from "../../../hooks/use-persisted-state";
import Button from "../../ui/button";
import TextInput from "../../ui/text-input";

import styles from "./styles.module.css";

interface ConnectionFormProps {
  menu: string;
}

function ConnectionForm({ menu }: ConnectionFormProps) {
  const [peopleName, setPeopleName] = usePersistedState(
    "@planning:people-name",
    ""
  );
  const [newRoomName, setNewRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { createRoom } = useRoom();

  async function handleConnectOnRoom(event: FormEvent) {
    event.preventDefault();

    try {
      await router.push(`/rooms/${roomCode}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const roomInfo = await createRoom(newRoomName);

      await router.push(`/rooms/${roomInfo.id}`);
    } finally {
      setIsLoading(false);
    }
  }

  switch (menu) {
    case "create":
      return (
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

          <Button disabled={isLoading}>Criar sala</Button>
        </form>
      );

    case "enter":
      return (
        <form className={styles.form} onSubmit={handleConnectOnRoom}>
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
          <Button disabled={isLoading}>Entrar na sala</Button>
        </form>
      );
  }
}

export { ConnectionForm };
