"use client"

import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import { useWallet } from '@meshsdk/react';
import { generateNonce, checkSignature, type IWallet } from '@meshsdk/core';
import dynamic from 'next/dynamic';

// Import CardanoWalletButton với dynamic để tránh SSR
const CardanoWalletButton = dynamic(
  () => import('./cardanowallet'),
  { ssr: false }
);

const Header = () => {
    const { connected, wallet } = useWallet();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        async function authenticateWallet() {
            if (wallet && connected) {
                try {
                    const addr = await getWalletAddress(wallet);
                    const nonce = generateNonce("Welcome to MedID - Secure your medical records on blockchain");
                    
                    // Xử lý ký và xác thực chữ ký với retry logic
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
                                    console.warn(`Xác thực chữ ký thất bại. Thử lại (${retryCount}/3)...`);
                                    // Hiển thị thông báo yêu cầu ký lại
                                    alert("Xác thực chữ ký thất bại. Vui lòng ký lại.");
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        } catch (signError) {
                            console.error("Lỗi khi ký:", signError);
                            retryCount++;
                            if (retryCount < 3) {
                                alert("Không thể ký tin nhắn. Vui lòng thử lại.");
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            } else {
                                throw signError;
                            }
                        }
                    }
                    
                    if (!result) {
                        alert("Không thể xác thực chữ ký sau nhiều lần thử. Vui lòng kết nối lại ví.");
                        throw new Error("Xác thực chữ ký thất bại sau nhiều lần thử");
                    }
                    
                    // Có thể gọi API để tạo/đăng ký người dùng ở đây
                    // await createUser(addr);
                    
                    setIsAuthenticated(true);
                    console.log("Ví đã được kết nối và xác thực thành công!");
                    
                } catch (error) {
                    console.error("Lỗi xác thực ví:", error);
                    alert("Lỗi kết nối ví: " + (error instanceof Error ? error.message : String(error)));
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        }
        
        authenticateWallet();
    }, [wallet, connected]);

    return (
        <header className={styles.header}>
            <div className={`${styles.container} ${styles.headerContent}`}>
                <div className={styles.logo}>MedID</div>
                <div className={styles.navigation}>
                    <ul className={styles.navLinks}>
                        <li><a href="/">Home</a></li>
                        <li className={styles.dropdown}>
                            <span className={styles.dropdownToggle}>Services</span>
                            <ul className={styles.dropdownMenu}>
                                <Link href="/service/hoso"><li>Hồ sơ</li></Link>
                                <Link href="/service/lockhoso"><li>Lock Hồ Sơ</li></Link>
                                <Link href="/service/unlock"><li>UnLock</li></Link>
                                <Link href="/service/update"><li>Update</li></Link>
                            </ul>
                        </li>
                        <li><a href="#">Blockchain Health</a></li>
                        <li className={styles.dropdown}>
                            <span className={styles.dropdownToggle}>Doctor Services</span>
                            <ul className={styles.dropdownMenu}>
                                <Link href="/service_doctor/doctor_lock"><li>Lock</li></Link>
                                <Link href="/service_doctor/doctor_update"><li>Update</li></Link>
                            </ul>
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

// Helper function để lấy địa chỉ ví
async function getWalletAddress(wallet: IWallet): Promise<string> {
    const addresses = await wallet.getUsedAddresses();
    return addresses[0];
}

export default Header;
