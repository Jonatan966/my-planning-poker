import {
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";

import { AppConfetti } from "../../components/ui/app-confetti";

interface ConfettiProviderProps {
  children: ReactNode;
}

interface ConfettiContextProps {
  showConfetti: MutableRefObject<confetti.CreateTypes>;
}

const ConfettiContext = createContext({} as ConfettiContextProps);

export function ConfettiProvider({ children }: ConfettiProviderProps) {
  const refConfettiInstance = useRef<confetti.CreateTypes>(null);

  const getInstance = useCallback((instance: confetti.CreateTypes) => {
    refConfettiInstance.current = instance;
  }, []);

  return (
    <ConfettiContext.Provider
      value={{
        showConfetti: refConfettiInstance,
      }}
    >
      <AppConfetti refConfetti={getInstance} />
      {children}
    </ConfettiContext.Provider>
  );
}

export const useConfetti = () => useContext(ConfettiContext);
