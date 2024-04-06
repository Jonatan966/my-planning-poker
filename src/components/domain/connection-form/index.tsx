import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useRoomStore } from "../../../stores/room-store";
import Button from "../../ui/button";
import TextInput from "../../ui/text-input";

import { HorizontalLine } from "../../ui/horizontal-line";
import { PeopleName } from "./people-name";
import styles from "./styles.module.css";

interface ConnectionFormProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

function ConnectionForm({ isLoading, setIsLoading }: ConnectionFormProps) {
  const [roomCode, setRoomCode] = useState("");

  const router = useRouter();

  const { createRoom } = useRoomStore((state) => ({
    createRoom: state.createRoom,
  }));

  async function handleConnectOnRoom(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 250));

    try {
      await router.push(`/rooms/${roomCode}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateRoom() {
    setIsLoading(true);

    try {
      const roomInfo = await createRoom("");

      await router.push(`/rooms/${roomInfo.id}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.form}>
      <form className={styles.box} onSubmit={handleConnectOnRoom}>
        <TextInput
          title="Código da sala"
          placeholder="Informe o código de uma sala existente"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          required
          disabled={isLoading}
          spellCheck={false}
        />

        <Button isLoading={isLoading} type="submit" colorScheme="secondary">
          Entrar na sala
        </Button>
      </form>

      <div className={styles.box}>
        <Button isLoading={isLoading} onClick={handleCreateRoom}>
          Criar sala
        </Button>
      </div>

      <HorizontalLine />

      <PeopleName isLoading={isLoading} />
    </div>
  );
}

export { ConnectionForm };
