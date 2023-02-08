import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React, { useRef } from "react";
import Head from "next/head";
import { Header } from "../components/Header";
import { useRouter } from "next/router";
import { api } from "../utils/api";

import "../styles/globals.css";
import { AppThemeProvider } from "../theme";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const showHeaderCompo = useRef(true);
  const showFooterCompo = useRef(true);

  showHeaderCompo.current = ["/register"].includes(router.route) ? false : true;
  showFooterCompo.current = ["/register", "/404"].includes(router.route)
    ? false
    : true;
  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={session}>
        <AppThemeProvider>
          {showHeaderCompo.current && <Header />}
          <Component {...pageProps} />
          {/* {showFooterCompo.current && <Footer />} */}
        </AppThemeProvider>
      </SessionProvider>
    </React.Fragment>
  );
};

export default api.withTRPC(App);
