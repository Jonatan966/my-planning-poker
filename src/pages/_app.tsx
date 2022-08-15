import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { RoomContextProvider } from "../contexts/room-context";

import "../styles/global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RoomContextProvider>
      <Toaster />
      <Component {...pageProps} />
    </RoomContextProvider>
  );
}
