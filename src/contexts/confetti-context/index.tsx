import {
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";

import { AppConfetti } from "../../components/ui/app-confetti";
import useStatefulRef from "../../hooks/use-stateful-ref";

interface ConfettiProviderProps {
  children: ReactNode;
}

interface ConfettiContextProps {
  showConfetti: MutableRefObject<confetti.CreateTypes>;
  confettiIsFiring: MutableRefObject<boolean>;
  fireScatteredConfetti(fireTimes?: number): Promise<void>;
  fireFocusedConfetti(origin?: confetti.Origin): Promise<void>;
}

const ConfettiContext = createContext({} as ConfettiContextProps);

export function ConfettiProvider({ children }: ConfettiProviderProps) {
  const refConfettiInstance = useRef<confetti.CreateTypes>(null);
  const confettiIsFiring = useStatefulRef<boolean>(false);

  const confettiStopDebounceId = useRef(-1);

  const getInstance = useCallback((instance: confetti.CreateTypes) => {
    if (!instance) {
      return undefined;
    }

    let injectedInstance = async (options: confetti.Options) => {
      confettiIsFiring.current = true;

      await instance(options);

      window.clearTimeout(confettiStopDebounceId.current);

      confettiStopDebounceId.current = window.setTimeout(
        () => (confettiIsFiring.current = false),
        750
      );
    };

    Object.assign(injectedInstance, {
      reset: instance.reset,
    });

    refConfettiInstance.current = injectedInstance as confetti.CreateTypes;
  }, []);

  async function fireScatteredConfetti(fireTimes = 12) {
    for (let confettiCount = fireTimes; confettiCount > 0; confettiCount--) {
      refConfettiInstance.current({
        origin: {
          x: Math.random(),
          y: Math.random() + 0.1,
        },
        particleCount: 250,
        spread: 100,
        colors: ["#00B7AB"],
      });

      const randomDelay = 450 + Math.random() * 250; //between 450ms to 700ms
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
    }
  }

  async function fireFocusedConfetti(
    origin: confetti.Origin = {
      x: 0.5,
      y: 1,
    }
  ) {
    await refConfettiInstance.current({
      startVelocity: 30,
      spread: 125,
      ticks: 60,
      zIndex: 0,
      particleCount: 100,
      origin,
    });
  }

  return (
    <ConfettiContext.Provider
      value={{
        showConfetti: refConfettiInstance,
        confettiIsFiring,
        fireScatteredConfetti,
        fireFocusedConfetti,
      }}
    >
      <AppConfetti refConfetti={getInstance} />
      {children}
    </ConfettiContext.Provider>
  );
}

export const useConfetti = () => useContext(ConfettiContext);
