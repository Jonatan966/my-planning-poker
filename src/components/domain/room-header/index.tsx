import classNames from "classnames";
import toast from "react-hot-toast";
import { BsFillSuitClubFill } from "react-icons/bs";

import Button from "../../ui/button";

import styles from "./styles.module.css";

function RoomHeader() {
  async function copyRoomCode() {
    toast.promise(navigator.clipboard.writeText(window.location.href), {
      error: "Não foi possível copiar o link da sala",
      loading: "Copiando link da sala...",
      success: "Link da sala copiado com sucesso!",
    });
  }

  return (
    <header className={styles.headerContainer}>
      <div>
        <strong>
          <BsFillSuitClubFill size={28} /> Fake
        </strong>
        <nav>
          <span
            className={classNames({
              [styles.isHost]: true,
            })}
          >
            Fake
          </span>
          <Button colorScheme="primary" onClick={copyRoomCode}>
            Copiar link da sala
          </Button>
          <Button colorScheme="danger">Sair</Button>
        </nav>
      </div>
    </header>
  );
}

export default RoomHeader;
