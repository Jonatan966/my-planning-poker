import { FaSpinner } from "react-icons/fa";
import Modal from "react-modal";
import Button from "../../ui/button";
import Dialog from "../../ui/dialog";

import styles from "./styles.module.css";

interface ConnectionModalProps {
  onRequestClose(): void;
  isOpen: boolean;
}

function ConnectionModal(props: ConnectionModalProps) {
  return (
    <Dialog {...props} className={styles.modalContainer}>
      <h1>Preparando as coisas</h1>

      <div className={styles.message}>
        <FaSpinner size={48} />
        <span>Tentando se conectar à sala...</span>
      </div>

      <Button colorScheme="danger" onClick={props.onRequestClose}>
        Cancelar
      </Button>
    </Dialog>
  );
}

export default ConnectionModal;
