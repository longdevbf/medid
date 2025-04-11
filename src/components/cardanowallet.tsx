"use client"

import React from 'react';
import { useWallet } from '@meshsdk/react';
import styles from './Header.module.css';

const CardanoWalletButton = () => {
  const { connect, disconnect, connected } = useWallet();

  // Chỉ sử dụng Eternl wallet
  const handleConnectEternl = () => {
    connect('eternl');
  };

  return (
    <div className={styles.walletButtonContainer}>
      {connected ? (
        <button 
          className={styles.walletButton}
          onClick={disconnect}
        >
          <img 
            src="/eternl-logo.svg" 
            alt="Eternl" 
            className={styles.walletIcon}
            onError={(e) => {
              // Fallback nếu ảnh không load được
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23fff' d='M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9zm-9-2h10V8H12v8z'/%3E%3C/svg%3E";
            }}
          />
          Disconnect
        </button>
      ) : (
        <button 
          className={styles.walletButton}
          onClick={handleConnectEternl}
        >
          <img 
            src="/eternl-logo.svg" 
            alt="Eternl" 
            className={styles.walletIcon}
            onError={(e) => {
              // Fallback nếu ảnh không load được
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23fff' d='M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9zm-9-2h10V8H12v8z'/%3E%3C/svg%3E";
            }}
          />
          Connect Eternl
        </button>
      )}
    </div>
  );
};

export default CardanoWalletButton;