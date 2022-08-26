import { FaSpinner } from "react-icons/fa";
import Button from "../../../ui/button";

import styles from "./styles.module.css";

interface ConnectingMessageProps {
  onCancelRoomConnection(): Promise<void>;
}

function ConnectingMessage({ onCancelRoomConnection }: ConnectingMessageProps) {
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

export { ConnectingMessage };
