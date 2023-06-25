import "@/styles/globals.css";
import { ModalProvider } from "@team.poi/ui/dist/cjs/hooks/Modal";
import "@team.poi/ui/src/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </SessionProvider>
  );
}
