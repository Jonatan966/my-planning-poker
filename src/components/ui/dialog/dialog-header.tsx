import { ReactNode } from "react";

import styles from "./styles.module.css";

interface DialogHeaderProps {
  title: string;
  children?: ReactNode;
}

export function DialogHeader({ title, children }: DialogHeaderProps) {
  return (
    <div className={styles.dialogHeader}>
      <h2>{title}</h2>
      {children && <div className={styles.dialogHeaderMenu}>{children}</div>}
    </div>
  );
}
