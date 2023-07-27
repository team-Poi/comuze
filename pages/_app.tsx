import "@/styles/globals.css";
import { ModalProvider } from "@team.poi/ui/dist/cjs/hooks/Modal";
import "@team.poi/ui/src/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { LoadingProvider } from "@/hooks/Loading";
import { AlertProvider } from "@/components/AlertBox/context";
import AlertBox from "@/components/AlertBox";

function Wrapper({ Component, pageProps }: AppProps) {
  let { status, data } = useSession();
  let router = useRouter();
  useEffect(() => {
    if (status == "loading") return;
    if (status == "unauthenticated") return;
    if (status == "authenticated" && data?.user.age == undefined) {
      router.push("/auth/optionalSet");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <ModalProvider>
      <LoadingProvider>
        <AlertProvider>
          <Component {...pageProps} />
          <ToastContainer autoClose={3000} />
          <AlertBox />
        </AlertProvider>
      </LoadingProvider>
    </ModalProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <meta property="og:title" content="Comuze / 학교 생활을 더 즐겁게" />
        <title>Comuze / 학교 생활을 더 즐겁게</title>
      </Head>
      <SessionProvider session={props.pageProps.session}>
        <Wrapper {...props} />
      </SessionProvider>
    </>
  );
}
