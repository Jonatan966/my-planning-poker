import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { useRoom } from "../../../contexts/room-context";
import Button from "../../ui/button";

import styles from "./styles.module.css";

function RoomHeader() {
  const { activeRoom, people } = useRoom();

  async function copyRoomCode() {
    toast.promise(navigator.clipboard.writeText(activeRoom?.id || ""), {
      error: "Não foi possível copiar o código da sala",
      loading: "Copiando código da sala...",
      success: "Código da sala copiado com sucesso!",
    });
  }

  return (
    <header className={styles.headerContainer}>
      <div>
        <strong>{activeRoom?.name}</strong>
        <nav>
          <span>
            {people?.isHost && <FaStar />} {people?.name}
          </span>
          <Button colorScheme="primary" onClick={copyRoomCode}>
            Copiar código da sala
          </Button>
          <Button colorScheme="danger">Sair</Button>
        </nav>
      </div>
    </header>
  );
}

export default RoomHeader;
