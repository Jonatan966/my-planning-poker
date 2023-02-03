import { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

import { ConfettiProvider } from "../contexts/confetti-context";
import { RoomAccessProvider } from "../contexts/room-access-context";

import "../styles/global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ConfettiProvider>
        <RoomAccessProvider>
          <Head>
            <title>My Planning Poker</title>
          </Head>
          <Toaster />
          <Component {...pageProps} />
        </RoomAccessProvider>
      </ConfettiProvider>
    </SessionProvider>
  );
}
