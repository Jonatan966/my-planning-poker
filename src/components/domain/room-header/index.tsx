import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { BsFillSuitClubFill } from "react-icons/bs";
import { useRoom } from "../../../contexts/room-context";

import Button from "../../ui/button";

import styles from "./styles.module.css";

interface RoomHeaderProps {
  basicMe: {
    id: string;
    name?: string;
  };
}

function RoomHeader({ basicMe }: RoomHeaderProps) {
  const { me, room, disconnectOnRoom } = useRoom();
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
          <BsFillSuitClubFill size={28} /> {room?.name}
        </strong>
        <nav>
          <span>{basicMe?.name || me?.name}</span>
          <Button colorScheme="primary" onClick={copyRoomCode}>
            Copiar link da sala
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
