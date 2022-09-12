import { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { EasterEgg } from "../components/domain/easter-egg";

import "../styles/global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>My Planning Poker</title>
      </Head>
      <Toaster />
      <EasterEgg />
      <Component {...pageProps} />
    </>
  );
}
