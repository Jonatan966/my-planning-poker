import { MouseEvent } from "react";
import toast from "react-hot-toast";

import { BsFillSuitClubFill } from "react-icons/bs";
import { FaLink, FaTrash } from "react-icons/fa";
import Button from "../../ui/button";

import styles from "./styles.module.css";

interface RoomCardProps {
  roomInfo: {
    id: string;
    name: string;
  };

  onRemoveRoom(id: string): void;
  onClick?: (roomId: string) => void;
}

function RoomCard({ roomInfo, onRemoveRoom, onClick }: RoomCardProps) {
  async function handleCopyRoomCode(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    const parsedUrl = `${window.location.origin}/rooms/${roomInfo.id}`;

    await toast.promise(navigator.clipboard.writeText(parsedUrl), {
      error: "Não foi possível copiar o link da sala",
      loading: "Copiando link da sala...",
      success: "Link da sala copiado com sucesso!",
    });
  }

  function handleRemoveRoom(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onRemoveRoom(roomInfo.id);
  }

  return (
    <div
      className={styles.roomCardContainer}
      tabIndex={0}
      role="button"
      onClick={() => onClick?.(roomInfo.id)}
    >
      <div className={styles.room}>
        <BsFillSuitClubFill size={40} className={styles.roomIcon} />
        <div className={styles.roomDetail}>
          <small>{roomInfo.id}</small>
          <h3>{roomInfo.name}</h3>
        </div>
      </div>

      <div className={styles.roomActions}>
        <Button title="Copiar link da sala" onClick={handleCopyRoomCode}>
          <FaLink />
        </Button>
        <Button
          colorScheme="danger"
          outlined
          title="Remover sala"
          onClick={handleRemoveRoom}
        >
          <FaTrash />
        </Button>
      </div>
    </div>
  );
}

export default RoomCard;
