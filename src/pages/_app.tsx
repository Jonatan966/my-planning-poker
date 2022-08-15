import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import "../styles/global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster />
      <Component {...pageProps} />
    </>
  );
}
