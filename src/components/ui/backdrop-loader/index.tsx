import { ReactNode } from "react";
import { FaSpinner } from "react-icons/fa";
import Portal from "../../engine/portal";

import styles from "./styles.module.css";

interface BackdropLoaderProps {
  children?: ReactNode;
}

function BackdropLoader({ children }: BackdropLoaderProps) {
  return (
    <Portal>
      <div className={styles.backdropContainer}>
        <FaSpinner className={styles.backdropSpinner} size={48} />
        <span>{children}</span>
      </div>
    </Portal>
  );
}

export default BackdropLoader;
