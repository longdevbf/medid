import "../styles/globals.css";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import Header from '../components/Header';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    
    <MeshProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </MeshProvider>
  );
}

export default MyApp;