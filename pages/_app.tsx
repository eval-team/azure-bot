import "@/app/globals.css";
import { AppProps } from "next/app";
import { SocketProvider } from "@/context/socket-context";

function MainComponent({ Component, pageProps, router }: AppProps) {
  return (
    <main>
      <Component {...pageProps} router={router} />
    </main>
  );
}

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <SocketProvider>
      <MainComponent
        Component={Component}
        pageProps={pageProps}
        router={router}
      />
    </SocketProvider>
  );
}
