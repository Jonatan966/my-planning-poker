import { FormEvent, useState } from "react";

import { useRoomStore } from "../../../stores/room-store";
import Button from "../../ui/button";
import TextInput from "../../ui/text-input";

import { useRoomAccess } from "../../../contexts/room-access-context";
import { HorizontalLine } from "../../ui/horizontal-line";
import { LastRoomAccess } from "./last-room-access";
import { PeopleName } from "./people-name";
import styles from "./styles.module.css";

interface ConnectionFormProps {
  isCreatingRoom: boolean;
  setIsCreatingRoom: (value: boolean) => void;
}

function ConnectionForm({
  isCreatingRoom,
  setIsCreatingRoom,
}: ConnectionFormProps) {
  const [roomCode, setRoomCode] = useState("");
  const { isVisitingRoom, onVisitRoom } = useRoomAccess();

  const isLoading = isVisitingRoom || isCreatingRoom;

  const { createRoom } = useRoomStore((state) => ({
    createRoom: state.createRoom,
  }));

  async function handleConnectOnRoom(event: FormEvent) {
    event.preventDefault();

    await onVisitRoom(roomCode);
  }

  async function handleCreateRoom() {
    setIsCreatingRoom(true);

    try {
      const roomId = await createRoom();

      await onVisitRoom(roomId);
    } finally {
      setIsCreatingRoom(false);
    }
  }

  async function accessLastVisitedRoom(room_id: string) {
    setRoomCode(room_id);
    await onVisitRoom(room_id);
  }

  return (
    <div className={styles.form}>
      <form className={styles.box} onSubmit={handleConnectOnRoom}>
        <div className={styles.roomCodeContainer}>
          <div className={styles.roomCodeInput}>
            <TextInput
              title="Código da sala"
              placeholder="Informe o código de uma sala existente"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              required
              disabled={isLoading}
              spellCheck={false}
            />
          </div>

          <LastRoomAccess
            onAccessLastVisitedRoom={accessLastVisitedRoom}
            isDisabled={isLoading}
          />
        </div>

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
