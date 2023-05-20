import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { BsInfoCircleFill } from "react-icons/bs";

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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlayingAlert, setIsPlayingAlert] = useState(false);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  function playAlert() {
    setIsPlayingAlert(true);

    audioRef.current
      .play()
      .catch(() => console.log("[afk-alert] Unable to play alert"));

    const alertMessage = "Estão te chamando para votar!";

    toast.success(alertMessage, {
      icon: <BsInfoCircleFill color="#4863f7" />,
      duration: FIVE_SECONDS,
    });

    Notification.requestPermission().then(() => {
      new Notification(alertMessage);
    });
  }

  function handleOnSoundEnded() {
    setIsPlayingAlert(false);
  }

  return (
    <AfkAlertContext.Provider
      value={{
        playAlert,
        isPlayingAlert,
      }}
    >
      <audio
        src="/sounds/afk-alert.wav"
        ref={audioRef}
        onEnded={handleOnSoundEnded}
      />
      {children}
    </AfkAlertContext.Provider>
  );
}

export const useAfkAlert = () => useContext(AfkAlertContext);
