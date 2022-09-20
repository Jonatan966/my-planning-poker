import { useRouter } from "next/router";
import { useState, FormEvent, useRef } from "react";
import { persistedCookieVars } from "../../../configs/persistent-cookie-vars";
import { cookieStorageManager } from "../../../utils/cookie-storage-manager";
import Button from "../../ui/button";
import TextInput from "../../ui/text-input";
import { useRoomStore } from "../../../stores/room-store";

import styles from "./styles.module.css";

interface ConnectionFormProps {
  menu: string;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

function ConnectionForm({
  menu,
  isLoading,
  setIsLoading,
}: ConnectionFormProps) {
  const peopleName = cookieStorageManager.getItem(
    persistedCookieVars.PEOPLE_NAME
  );

  const peopleNameInputRef = useRef<HTMLInputElement>();

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

    cookieStorageManager.setItem(
      persistedCookieVars.PEOPLE_NAME,
      peopleNameInputRef.current.value
    );

    try {
      await router.push(`/rooms/${roomCode}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    cookieStorageManager.setItem(
      persistedCookieVars.PEOPLE_NAME,
      peopleNameInputRef.current.value
    );

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
          <TextInput
            title="Seu nome"
            placeholder="Ex: John Doe"
            defaultValue={peopleName}
            ref={peopleNameInputRef}
            required
            maxLength={20}
            disabled={isLoading}
          />
          <TextInput
            placeholder="Ex: Planejamento semanal"
            title="Nome da sala"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            maxLength={32}
            disabled={isLoading}
          />

          <Button isLoading={isLoading}>Criar sala</Button>
        </form>
      );

    case "enter":
      return (
        <form className={styles.form} onSubmit={handleConnectOnRoom}>
          <TextInput
            title="Seu nome"
            placeholder="Ex: John Doe"
            defaultValue={peopleName}
            ref={peopleNameInputRef}
            required
            maxLength={20}
            disabled={isLoading}
          />
          <TextInput
            title="Código da sala"
            placeholder="Ex: 4d71a4a3-f191-498d-a160-2de65febcb4e"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button isLoading={isLoading}>Entrar na sala</Button>
        </form>
      );
  }
}

export { ConnectionForm };
