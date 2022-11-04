import { ReactNode } from "react";

import styles from "./styles.module.css";

interface DialogHeaderProps {
  title: ReactNode;
  children?: ReactNode;
}

export function DialogHeader({ title, children }: DialogHeaderProps) {
  return (
    <div className={styles.dialogHeader}>
      <h3>{title}</h3>
      {children && <div className={styles.dialogHeaderMenu}>{children}</div>}
    </div>
  );
}
