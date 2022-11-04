import { useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useConfetti } from "../../../../contexts/confetti-context";

import Button from "../../../ui/button";

import styles from "./styles.module.css";

interface SuccessMessageProps {
  onRecreateFeedback(): void;
}

export function SuccessMessage({ onRecreateFeedback }: SuccessMessageProps) {
  const { fireFocusedConfetti } = useConfetti();

  useEffect(() => {
    fireFocusedConfetti({
      x: 0.5,
      y: 0.75,
    });
  }, []);

  return (
    <>
      <div className={styles.successMessage}>
        <FaCheckCircle size={48} />
        <p>Obrigado por nos ajudar com um feedback!</p>
      </div>
      <Button onClick={onRecreateFeedback}>Novo feedback</Button>
    </>
  );
}
