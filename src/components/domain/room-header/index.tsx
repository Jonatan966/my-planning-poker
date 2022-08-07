import classNames from "classnames";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRoom } from "../../../contexts/room-context";
import Button from "../../ui/button";

import styles from "./styles.module.css";

function RoomHeader() {
  const { activeRoom, people, leaveRoom } = useRoom();
  const navigate = useNavigate();

  async function copyRoomCode() {
    toast.promise(navigator.clipboard.writeText(window.location.href), {
      error: "Não foi possível copiar o link da sala",
      loading: "Copiando link da sala...",
      success: "Link da sala copiado com sucesso!",
    });
  }

  function handleLeaveRoom() {
    navigate("/");
    leaveRoom();
  }

  return (
    <header className={styles.headerContainer}>
      <div>
        <strong>{activeRoom?.name}</strong>
        <nav>
          <span
            className={classNames({
              [styles.isHost]: people?.isHost,
            })}
          >
            {people?.name}
          </span>
          <Button colorScheme="primary" onClick={copyRoomCode}>
            Copiar link da sala
          </Button>
          <Button colorScheme="danger" onClick={handleLeaveRoom}>
            Sair
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default RoomHeader;
