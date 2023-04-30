import { ReactNode, createContext, useContext, useRef, useState } from "react";

interface AfkAlertProviderProps {
  children: ReactNode;
}

interface AfkAlertContextProps {
  playAlert(): void;
  isPlayingAlert: boolean;
}

const AfkAlertContext = createContext({} as AfkAlertContextProps);

export function AfkAlertProvider({ children }: AfkAlertProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlayingAlert, setIsPlayingAlert] = useState(false);

  function playAlert() {
    setIsPlayingAlert(true);
    audioRef.current.play();
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
