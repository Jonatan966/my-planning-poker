import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import Button from "../../ui/button";
import Dialog from "../../ui/dialog";

import { useDialog } from "../../../hooks/use-dialog";
import { useRoomStore } from "../../../stores/room-store";
import { convertSecondsToTime } from "../../../utils/convert-seconds-to-time";
import styles from "./styles.module.css";

const ONE_MINUTE = 60;
const THIRTY_SECONDS = 30;
const TWO_MINUTES = ONE_MINUTE * 2;
const THREE_MINUTES_MILISECONDS = 1000 * 60 * 3;

export function InactivityDialog() {
  const router = useRouter();
  const { closeDialog, isOpen, openDialog } = useDialog();
  const { me, broadcastInactivity } = useRoomStore((state) => ({
    me: state.peoples?.[state.basicInfo.subscription?.members?.myID],
    broadcastInactivity: state.broadcastInactivity,
  }));

  const inactivityTimer = useRef(-1);

  function onShowInactivityDialog() {
    broadcastInactivity(false);
    openDialog();
  }

  function onConfirmActivity() {
    broadcastInactivity(true);
    closeDialog();
  }

  useEffect(() => {
    if (!me || isOpen) {
      return;
    }

    clearTimeout(inactivityTimer.current);

    inactivityTimer.current = Number(
      setTimeout(onShowInactivityDialog, THREE_MINUTES_MILISECONDS)
    );
  }, [me, isOpen]);

  return (
    <Dialog isOpen={isOpen} onRequestClose={closeDialog}>
      <h2>Ainda tem alguém aí?</h2>
      <div className={styles.countdownSpinner}>
        <CountdownCircleTimer
          isPlaying={isOpen}
          duration={TWO_MINUTES}
          colors={["#4863f7", "#eb8a1d", "#f75a68"]}
          colorsTime={[TWO_MINUTES, THIRTY_SECONDS, 0]}
          trailColor="#121214"
          size={128}
          strokeWidth={12}
          onComplete={() => {
            router.replace("/");
          }}
        >
          {({ remainingTime }) => (
            <strong>{convertSecondsToTime(remainingTime)}</strong>
          )}
        </CountdownCircleTimer>
      </div>
      <p className={styles.message}>
        Não identificamos nenhuma interação por muito tempo, tem alguém aí? Se
        nada for feito, dentro de alguns instantes{" "}
        <b>sua sessão será encerrada</b>
      </p>

      <div className={styles.inactivityActions}>
        <Link href="/">
          <Button colorScheme="danger" outlined>
            Sair
          </Button>
        </Link>
        <Button colorScheme="secondary" onClick={onConfirmActivity}>
          Continuar na sala
        </Button>
      </div>
    </Dialog>
  );
}
