import { appConfig } from "../../../configs/app";
import styles from "./styles.module.css";

export function DevCredits() {
  return (
    <span className={styles.devCreditsText}>
      Feito com ❤️ por{" "}
      <a
        href={appConfig.creatorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.devLink}
      >
        Jonatan
      </a>{" "}
      e <span className={styles.pig}>🐷</span>
    </span>
  );
}
