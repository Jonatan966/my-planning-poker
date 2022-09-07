import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { BsFillSuitClubFill } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import { useRoom } from "../../../contexts/room-context";

import Button from "../../ui/button";

import styles from "./styles.module.css";

interface RoomHeaderProps {
  basicMe: {
    id: string;
    name?: string;
  };
  basicRoomInfo: {
    id: string;
    name: string;
  };
}

function RoomHeader({ basicMe, basicRoomInfo }: RoomHeaderProps) {
  const { me, disconnectOnRoom } = useRoom();
  const router = useRouter();

  async function copyRoomCode() {
    toast.promise(navigator.clipboard.writeText(window.location.href), {
      error: "Não foi possível copiar o link da sala",
      loading: "Copiando link da sala...",
      success: "Link da sala copiado com sucesso!",
    });
  }

  async function handleDisconnectOnRoom() {
    await router.replace("/");
    disconnectOnRoom();
  }

  return (
    <header className={styles.headerContainer}>
      <div>
        <strong className={styles.room}>
          <BsFillSuitClubFill size={28} /> {basicRoomInfo.name}
        </strong>
        <nav>
          <span className={styles.myName}>{basicMe?.name || me?.name}</span>
          <Button
            colorScheme="primary"
            onClick={copyRoomCode}
            className={styles.copyRoomCode}
            title="Copiar link da sala"
          >
            <p>Copiar link da sala</p>
            <FaLink />
          </Button>
          <Button colorScheme="danger" onClick={handleDisconnectOnRoom}>
            Sair
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default RoomHeader;
