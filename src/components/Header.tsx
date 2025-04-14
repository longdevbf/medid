"use client";

import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '@meshsdk/react';
import { generateNonce, checkSignature, type IWallet } from '@meshsdk/core';
import dynamic from 'next/dynamic';

const CardanoWalletButton = dynamic(() => import('./cardanowallet'), {
  ssr: false,
});

const Header: React.FC = () => {
  const { connected, wallet } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function authenticateWallet() {
      if (wallet && connected) {
        try {
          const addr = await getWalletAddress(wallet);
          const nonce = generateNonce(
            'Welcome to MedID - Secure your medical records on blockchain'
          );
          let signature;
          let result = false;
          let retryCount = 0;

          while (!result && retryCount < 3) {
            try {
              signature = await wallet.signData(nonce, addr);
              result = await checkSignature(nonce, signature, addr);

              if (!result) {
                retryCount++;
                if (retryCount < 3) {
                  console.warn(
                    `Xác thực chữ ký thất bại. Thử lại (${retryCount}/3)...`
                  );
                  alert('Xác thực chữ ký thất bại. Vui lòng ký lại.');
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                }
              }
            } catch (signError) {
              console.error('Lỗi khi ký:', signError);
              retryCount++;
              if (retryCount < 3) {
                alert('Không thể ký tin nhắn. Vui lòng thử lại.');
                await new Promise((resolve) => setTimeout(resolve, 1000));
              } else {
                throw signError;
              }
            }
          }

          if (!result) {
            alert(
              'Không thể xác thực chữ ký sau nhiều lần thử. Vui lòng kết nối lại ví.'
            );
            throw new Error('Xác thực chữ ký thất bại sau nhiều lần thử');
          }

          setIsAuthenticated(true);
          console.log('Ví đã được kết nối và xác thực thành công!');
          router.push('/did/verifyyourdid'); // Điều hướng khi xác thực thành công
        } catch (error) {
          console.error('Lỗi xác thực ví:', error);
          alert(
            'Lỗi kết nối ví: ' +
              (error instanceof Error ? error.message : String(error))
          );
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        router.push('/'); // Điều hướng về home khi ngắt kết nối
      }
    }

    authenticateWallet();
  }, [wallet, connected, router]);

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerContent}`}>
        <div className={styles.logo}>MedID</div>
        <div className={styles.navigation}>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/service/adapter" className={styles.navLink}>
                Services
              </Link>
            </li>
            <li>
              <Link href="/blockchain-health" className={styles.navLink}>
                Blockchain Health
              </Link>
            </li>
            <li>
              <Link href="/service_doctor/adapter" className={styles.navLink}>
                Doctor Services
              </Link>
            </li>
          </ul>

          <div className={styles.walletContainer}>
            {isAuthenticated && (
              <span className={styles.authStatus}>✓ Verified</span>
            )}
            <CardanoWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};

async function getWalletAddress(wallet: IWallet): Promise<string> {
  const addresses = await wallet.getUsedAddresses();
  return addresses[0];
}

export default Header;