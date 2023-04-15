import { ReactNode, createContext, useContext, useRef } from "react";

interface AfkAlertProviderProps {
  children: ReactNode;
}

interface AfkAlertContextProps {
  playAlert(): void;
}

const AfkAlertContext = createContext({} as AfkAlertContextProps);

export function AfkAlertProvider({ children }: AfkAlertProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  function playAlert() {
    audioRef.current.play();
  }

  return (
    <AfkAlertContext.Provider
      value={{
        playAlert,
      }}
    >
      <audio src="/sounds/afk-alert.wav" ref={audioRef} />
      {children}
    </AfkAlertContext.Provider>
  );
}

export const useAfkAlert = () => useContext(AfkAlertContext);
