"use client";

import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '@meshsdk/react';
import { generateNonce, checkSignature, deserializeAddress } from '@meshsdk/core';
import { encryptData } from '../secret/encryptAndDecrypt';
import { checkUserInDatabase, saveUserToDatabase } from '../service/userService';
import dynamic from 'next/dynamic';

const CardanoWalletButton = dynamic(() => import('./cardanowallet'), {
  ssr: false,
});

const Header: React.FC = () => {
  const { connected, wallet } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);
  const router = useRouter();

  // Kiểm tra nếu đã xác thực trước đó
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = sessionStorage.getItem('medid_authenticated');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Xử lý xác thực khi kết nối ví
  useEffect(() => {
    async function authenticateWallet() {
      // Chỉ xác thực khi connected thay đổi từ false -> true và chưa xác thực
      if (wallet && connected && !isProcessing && !isAuthenticated && !hasAttemptedAuth) {
        setIsProcessing(true);
        setHasAttemptedAuth(true); // Đánh dấu đã thử xác thực để tránh lặp lại
        
        try {
          // Lấy địa chỉ ví
          const addr = await getWalletAddress(wallet);
          
          // Tạo và xác thực nonce
          const nonce = generateNonce(
            'Welcome to MedID - Secure your medical records on blockchain'
          );
          
          console.log('Yêu cầu người dùng ký tin nhắn...');
          
          // Thêm xử lý lỗi và retry logic cho việc ký
          let signature;
          let isValid = false;
          let retryCount = 0;
          
          while (!isValid && retryCount < 3) {
            try {
              signature = await wallet.signData(nonce, addr);
              isValid = await checkSignature(nonce, signature, addr);
              
              if (!isValid) {
                retryCount++;
                if (retryCount < 3) {
                  console.warn(`Xác thực chữ ký thất bại. Thử lại lần ${retryCount}/3...`);
                  await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1 giây trước khi thử lại
                }
              }
            } catch (signError) {
              console.error('Lỗi khi ký tin nhắn:', signError);
              retryCount++;
              if (retryCount < 3) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              } else {
                throw signError; // Ném lỗi nếu đã thử quá 3 lần
              }
            }
          }
          
          if (!isValid) {
            console.error('Xác thực chữ ký thất bại sau nhiều lần thử');
            alert('Xác thực chữ ký thất bại. Vui lòng thử lại sau.');
            setIsProcessing(false);
            setHasAttemptedAuth(false);
            return;
          }
          
          console.log('Xác thực chữ ký thành công!');

          // Xác thực thành công, giờ lấy pubKey và lưu thông tin user
          const { pubKeyHash } = deserializeAddress(addr);
          
          // Tạo did_number bằng cách mã hóa địa chỉ ví
          const encryptionKey = "00000000";
          const did_number = encryptData(addr, encryptionKey);
          
          console.log('Đang lưu thông tin người dùng...');
          console.log('Địa chỉ ví:', addr);
          console.log('PubKey:', pubKeyHash);
          console.log('DID Number:', did_number);
          
          try {
            // Kiểm tra xem user đã có trong database chưa
            const existingDid = await checkUserInDatabase(addr, pubKeyHash);
            
            if (existingDid === null) {
              // Nếu chưa có, lưu mới vào database
              console.log("User chưa tồn tại, đang tạo mới...");
              try {
                const userId = await saveUserToDatabase(addr, pubKeyHash, did_number);
                console.log('Đã lưu thông tin user mới thành công!', { userId, did_number });
                
                // Lưu DID vào session storage
                sessionStorage.setItem('medid_did_number', did_number);
              } catch (saveError) {
                console.error("Lỗi khi lưu user mới:", saveError);
                // Vẫn có thể tiếp tục và lưu DID tạo mới
                sessionStorage.setItem('medid_did_number', did_number);
              }
            } else {
              console.log('User đã tồn tại với DID:', existingDid);
              // Lưu DID hiện có vào session storage
              sessionStorage.setItem('medid_did_number', existingDid);
            }
          
            // Lưu trạng thái xác thực và địa chỉ ví
            sessionStorage.setItem('medid_authenticated', 'true');
            sessionStorage.setItem('medid_wallet_address', addr);
            
            setIsAuthenticated(true);
            console.log('Ví đã được kết nối và xác thực thành công!');
            
            // Điều hướng khi xác thực thành công
            router.push('/did/verifyyourdid');
          } catch (dbError) {
            console.error('Lỗi khi làm việc với database:', dbError);
            
            // Vẫn xác thực thành công nhưng thông báo về lỗi database
            alert(`Đã xác thực thành công nhưng có lỗi khi lưu thông tin: ${dbError}. Dữ liệu sẽ chỉ được lưu cục bộ.`);
            
            // Lưu thông tin vào session để người dùng vẫn có thể sử dụng ứng dụng
            sessionStorage.setItem('medid_authenticated', 'true');
            sessionStorage.setItem('medid_wallet_address', addr);
            sessionStorage.setItem('medid_did_number', did_number);
            
            setIsAuthenticated(true);
            router.push('/did/verifyyourdid');
          }
        } catch (error) {
          console.error('Lỗi xác thực ví:', error);
          alert(
            'Lỗi kết nối ví: ' +
              (error instanceof Error ? error.message : String(error))
          );
          setIsAuthenticated(false);
          setHasAttemptedAuth(false); // Reset để có thể thử lại
        } finally {
          setIsProcessing(false);
        }
      } else if (!connected) {
        // Reset khi ngắt kết nối ví
        setIsAuthenticated(false);
        setHasAttemptedAuth(false);
        sessionStorage.removeItem('medid_authenticated');
        sessionStorage.removeItem('medid_wallet_address');
        sessionStorage.removeItem('medid_did_number');
      }
    }

    authenticateWallet();
  }, [wallet, connected, router, isProcessing, isAuthenticated, hasAttemptedAuth]);

  // Hàm kết nối ví thủ công (khi người dùng click)
  const handleConnectWallet = () => {
    setHasAttemptedAuth(false); // Reset để có thể thử lại xác thực
  };

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
            {isProcessing && (
              <span className={styles.processingStatus}>⟳ Processing...</span>
            )}
            <div onClick={handleConnectWallet}>
              <CardanoWalletButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

async function getWalletAddress(wallet: any): Promise<string> {
  const addresses = await wallet.getUsedAddresses();
  return addresses[0];
}

export default Header;