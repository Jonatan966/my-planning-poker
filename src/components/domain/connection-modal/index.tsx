import { FaSpinner } from "react-icons/fa";
import Modal from "react-modal";
import Button from "../../ui/button";

import styles from "./styles.module.css";

interface ConnectionModalProps {
  onRequestClose(): void;
  isOpen: boolean;
}

function ConnectionModal(props: ConnectionModalProps) {
  return (
    <Modal
      {...props}
      overlayClassName={styles.modalOverlay}
      className={styles.modalContainer}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <h1>Preparando as coisas</h1>

      <div className={styles.message}>
        <FaSpinner size={48} />
        <span>Tentando se conectar à sala...</span>
      </div>

      <Button colorScheme="danger" onClick={props.onRequestClose}>
        Cancelar
      </Button>
    </Modal>
  );
}

export default ConnectionModal;
