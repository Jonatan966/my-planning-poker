import { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { ConfettiProvider } from "../contexts/confetti-context";
import { RoomAccessProvider } from "../contexts/room-access-context";

import "../styles/global.css";
import { AfkAlertProvider } from "../contexts/afk-alert-context";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfettiProvider>
      <RoomAccessProvider>
        <AfkAlertProvider>
          <Head>
            <title>My Planning Poker</title>
          </Head>
          <Toaster />
          <Component {...pageProps} />
        </AfkAlertProvider>
      </RoomAccessProvider>
    </ConfettiProvider>
  );
}
