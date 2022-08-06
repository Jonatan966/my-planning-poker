import { FaStar } from "react-icons/fa";
import { People } from "../../../contexts/room-context";
import Button from "../../ui/button";

import styles from "./styles.module.css";

interface RoomHeaderProps {
  code?: string;
  name?: string;
  people?: People;
}

function RoomHeader({ code, name, people }: RoomHeaderProps) {
  return (
    <header className={styles.headerContainer}>
      <div>
        <strong>{name}</strong>
        <nav>
          <span>
            {people?.isHost && <FaStar />} {people?.name}
          </span>
          <Button colorScheme="primary">Copiar link da sala</Button>
          <Button colorScheme="danger">Sair</Button>
        </nav>
      </div>
    </header>
  );
}

export default RoomHeader;
