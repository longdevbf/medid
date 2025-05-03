import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/chatWidget';
import { ChatProvider } from '../api';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [walletAddress, setWalletAddress] = useState<string>('');
  
  // Lấy địa chỉ ví từ session storage khi ứng dụng khởi động
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const address = sessionStorage.getItem('medid_wallet_address') || '';
      setWalletAddress(address);
    }
  }, []);
  
  // Lắng nghe thay đổi trong sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const address = sessionStorage.getItem('medid_wallet_address') || '';
      setWalletAddress(address);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return (
    <MeshProvider>
      <ChatProvider walletAddress={walletAddress}>
        <Header />
        <Component {...pageProps} />
        <Footer />
        {walletAddress && <ChatWidget />}
      </ChatProvider>
    </MeshProvider>
  );
}

export default MyApp;