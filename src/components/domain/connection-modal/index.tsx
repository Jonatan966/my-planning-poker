import classNames from "classnames";
import { FormEvent, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRoom } from "../../../contexts/room-context";
import { storageManager } from "../../../utils/storage-manager";
import Button from "../../ui/button";
import Dialog from "../../ui/dialog";
import TextInput from "../../ui/text-input";

import styles from "./styles.module.css";

interface ConnectionModalProps {
  onRequestClose(): void;
  isOpen: boolean;
  roomId: string;
}

function ConnectionModal({
  onRequestClose,
  isOpen,
  roomId,
}: ConnectionModalProps) {
  const { connectOnRoom, leaveRoom, peer, isReady, activeRoom } = useRoom();
  const [peopleName, setPeopleName] = useState(
    storageManager.getItem<string>("@planning:people-name") || ""
  );
  const [isFillPeopleName, setIsFillPeopleName] = useState(!!peopleName);
  const navigate = useNavigate();

  function onCancelRoomConnection() {
    navigate("/");
    leaveRoom();
    onRequestClose();
  }

  useEffect(() => {
    async function handleConnectOnRoom() {
      if (roomId !== peer.id && activeRoom?.id !== roomId) {
        await connectOnRoom(roomId, peopleName);
      }

      onRequestClose();
    }

    if (isReady && isFillPeopleName && !activeRoom?.hasLostConnection) {
      handleConnectOnRoom();
    }
  }, [isReady, isFillPeopleName, peopleName]);

  function handleConnectOnRoom(event: FormEvent) {
    event.preventDefault();
    storageManager.setItem("@planning:people-name", peopleName);
    setIsFillPeopleName(true);
  }

  function renderContent() {
    if (activeRoom?.hasLostConnection) {
      return (
        <>
          <h1>Ocorreu um erro</h1>
          <p>
            A conexão com o <b className={styles.hostText}>dono da sala</b> foi
            perdida
          </p>
          <Button colorScheme="danger" onClick={onCancelRoomConnection}>
            Retornar a home
          </Button>
        </>
      );
    }

    if (isFillPeopleName) {
      return (
        <>
          <h1>Preparando as coisas</h1>

          <div className={styles.message}>
            <FaSpinner size={48} />
            <span>Tentando se conectar à sala...</span>
          </div>

          <Button colorScheme="danger" onClick={onCancelRoomConnection}>
            Cancelar
          </Button>
        </>
      );
    }

    return (
      <>
        <h1>Precisamos saber seu nome</h1>
        <form className={styles.form} onSubmit={handleConnectOnRoom}>
          <TextInput
            title="Seu nome"
            placeholder="Ex: John Doe"
            onChange={(e) => setPeopleName(e.target.value)}
            value={peopleName}
            required
            maxLength={20}
          />

          <div className={styles.formButtons}>
            <Button
              type="button"
              colorScheme="danger"
              onClick={onCancelRoomConnection}
            >
              Cancelar
            </Button>
            <Button disabled={!isReady}>Entrar na sala</Button>
          </div>
        </form>
      </>
    );
  }

  return (
    <Dialog
      isOpen={isOpen}
      onRequestClose={onCancelRoomConnection}
      className={classNames(styles.modalContainer, {
        [styles.isLoading]: isFillPeopleName && !activeRoom?.hasLostConnection,
      })}
    >
      {renderContent()}
    </Dialog>
  );
}

export default ConnectionModal;
