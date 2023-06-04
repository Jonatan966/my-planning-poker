import { ReactNode, createContext, useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import { BsInfoCircleFill } from "react-icons/bs";
import { useAudio } from "../../hooks/use-audio";

interface AfkAlertProviderProps {
  children: ReactNode;
}

interface AfkAlertContextProps {
  playAlert(): void;
  isPlayingAlert: boolean;
}

const FIVE_SECONDS = 5000;

const AfkAlertContext = createContext({} as AfkAlertContextProps);

export function AfkAlertProvider({ children }: AfkAlertProviderProps) {
  const { playAudio, isPlayingAudio } = useAudio("afk-alert.wav");

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  function playAlert() {
    playAudio().then();

    const alertMessage = "Estão te chamando para votar!";

    toast.success(alertMessage, {
      icon: <BsInfoCircleFill color="#4863f7" />,
      duration: FIVE_SECONDS,
    });

    Notification.requestPermission().then(() => {
      new Notification(alertMessage);
    });
  }

  return (
    <AfkAlertContext.Provider
      value={{
        playAlert,
        isPlayingAlert: isPlayingAudio,
      }}
    >
      {children}
    </AfkAlertContext.Provider>
  );
}

export const useAfkAlert = () => useContext(AfkAlertContext);
