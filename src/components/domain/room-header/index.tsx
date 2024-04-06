import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FaLink } from "react-icons/fa";
import { useRoomStore } from "../../../stores/room-store";

import Button from "../../ui/button";
import { FeedbackDialog } from "../feedback-dialog";

import { Tooltip } from "../../ui/tooltip";
import { RoomLogo } from "./room-logo";
import styles from "./styles.module.css";

interface RoomHeaderProps {
  basicMe: {
    name?: string;
  };
}

function RoomHeader({ basicMe }: RoomHeaderProps) {
  const { disconnectOnRoom, room } = useRoomStore((state) => ({
    disconnectOnRoom: state.disconnectOnRoom,
    room: state.basicInfo,
  }));
  const router = useRouter();

  const myName = basicMe?.name || room?.subscription?.members?.me?.info.name;

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
      <nav>
        <div className={styles.my}>
          <RoomLogo />
          <span>{myName}</span>
        </div>
        <FeedbackDialog />
        <Tooltip message="Copiar link da sala">
          <Button
            colorScheme="primary"
            onClick={copyRoomCode}
            className={styles.copyRoomCode}
            isShort
          >
            <FaLink />
            <p>Copiar link</p>
          </Button>
        </Tooltip>
        <Button colorScheme="danger" outlined onClick={handleDisconnectOnRoom}>
          Sair
        </Button>
      </nav>
    </header>
  );
}

export default RoomHeader;
