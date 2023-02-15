import { useRouter } from "next/router";

import { useState, FormEvent, ReactNode, useMemo, useRef } from "react";
import Button from "../../ui/button";
import { TextInput } from "../../ui/text-input";
import { useRoomStore } from "../../../stores/room-store";

import styles from "./styles.module.css";
import { PeopleInput } from "./people-input";
import { validateUUID } from "../../../utils/validate-uuid";

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
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const roomCodeInputRef = useRef<HTMLInputElement>();

  const queryRoomCode = useMemo(() => {
    const code = router.query?.room_id as string;

    const isValidQueryRoomCode = validateUUID(code);

    if (!isValidQueryRoomCode) {
      return "";
    }

    return code;
  }, [router]);

  const { createRoom } = useRoomStore((state) => ({
    createRoom: state.createRoom,
  }));

  async function handleConnectOnRoom(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 250));

    const roomCode = roomCodeInputRef.current.value;

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
              defaultValue={queryRoomCode}
              ref={roomCodeInputRef}
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
