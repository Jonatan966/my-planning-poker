import { useRouter } from "next/router";
import { createContext, ReactNode, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import BackdropLoader from "../../components/ui/backdrop-loader";

interface RoomAccessContextProps {
  isVisitingRoom: boolean;
  onVisitRoom(roomId: string): Promise<void>;
}

interface RoomAccessProviderProps {
  children: ReactNode;
}

const RoomAccessContext = createContext({} as RoomAccessContextProps);

export function RoomAccessProvider({ children }: RoomAccessProviderProps) {
  const [isVisitingRoom, setIsVisitingRoom] = useState(false);
  const router = useRouter();

  async function onVisitRoom(roomId: string) {
    setIsVisitingRoom(true);

    try {
      await router.push(`/rooms/${roomId}`);
    } catch {
      toast.error("Não foi possível entrar na sala");
    }

    setIsVisitingRoom(false);
  }

  return (
    <RoomAccessContext.Provider value={{ isVisitingRoom, onVisitRoom }}>
      {children}

      {isVisitingRoom && <BackdropLoader>Encontrando a sala...</BackdropLoader>}
    </RoomAccessContext.Provider>
  );
}

export const useRoomAccess = () => useContext(RoomAccessContext);
