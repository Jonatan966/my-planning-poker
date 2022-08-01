import Button from "../button";

import styles from "./styles.module.css";

function RoomHeader() {
  return (
    <header className={styles.headerContainer}>
      <div>
        <strong>Sala tal</strong>
        <nav>
          <span>Jonas</span>
          <Button colorScheme="primary">Copiar link da sala</Button>
          <Button colorScheme="danger">Sair</Button>
        </nav>
      </div>
    </header>
  );
}

export default RoomHeader;
