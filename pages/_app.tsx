import "@/styles/globals.css";
import { ModalProvider } from "@team.poi/ui/dist/cjs/hooks/Modal";
import "@team.poi/ui/src/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import Script from "next/script";
import * as gtag from "@/utils/gtag";

import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { LoadingProvider } from "@/hooks/Loading";

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
        <Component {...pageProps} />
        <ToastContainer autoClose={3000} />
      </LoadingProvider>
    </ModalProvider>
  );
}

export default function App(props: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <Head>
        <meta property="og:title" content="Comuze / 학교 생활을 더 즐겁게" />
        <title>Comuze / 학교 생활을 더 즐겁게</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <SessionProvider session={props.pageProps.session}>
        <Wrapper {...props} />
      </SessionProvider>
    </>
  );
}
