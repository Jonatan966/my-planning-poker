import { useRouter } from "next/router";
import { useState, FormEvent, ReactNode } from "react";
import Button from "../../ui/button";
import { TextInput } from "../../ui/text-input";
import { useRoomStore } from "../../../stores/room-store";

import styles from "./styles.module.css";
import { PeopleInput } from "./people-input";

interface ConnectionFormProps {
  children?: ReactNode;
  menu: string;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

function ConnectionForm({
  menu,
  isLoading,
  children,
  setIsLoading,
}: ConnectionFormProps) {
  const [roomName, setRoomName] = useState("");
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

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const roomInfo = await createRoom(roomName);

      await router.push(`/rooms/${roomInfo.id}`);
    } finally {
      setIsLoading(false);
    }
  }

  switch (menu) {
    case "create":
      return (
        <form className={styles.form} onSubmit={handleCreateRoom}>
          <PeopleInput disabled={isLoading} />

          <TextInput.Root title="Nome da sala">
            <TextInput.Input
              placeholder="Informe um nome para a nova sala"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              maxLength={32}
              disabled={isLoading}
            />
          </TextInput.Root>

          {children}

          <Button isLoading={isLoading} type="submit">
            Criar sala
          </Button>
        </form>
      );

    case "enter":
      return (
        <form className={styles.form} onSubmit={handleConnectOnRoom}>
          <PeopleInput disabled={isLoading} />

          <TextInput.Root title="Código da sala">
            <TextInput.Input
              placeholder="Informe o código de uma sala existente"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              required
              disabled={isLoading}
            />
          </TextInput.Root>

          {children}

          <Button isLoading={isLoading} type="submit">
            Entrar na sala
          </Button>
        </form>
      );
  }
}

export { ConnectionForm };
