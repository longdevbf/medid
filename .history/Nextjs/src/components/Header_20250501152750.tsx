"use client";

import React, { useEffect, useState, useRef } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet, useWalletList } from '@meshsdk/react';
import { generateNonce, checkSignature, deserializeAddress } from '@meshsdk/core';
import { encryptData } from '../secret/encryptAndDecrypt';
import { checkUserInDatabase, saveUserToDatabase } from '../service/userService';
import { Copy, ExternalLink, LogOut, ChevronDown } from "lucide-react";

const Header: React.FC = () => {
  // MeshSDK wallet states
  const { connected, wallet, name, connect, disconnect } = useWallet();
  const wallets = useWalletList();

  // UI states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [walletDetailsOpen, setWalletDetailsOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  
  // Refs for clickaway detection
  const walletDropdownRef = useRef<HTMLDivElement>(null);
  const walletDetailsRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();

  // Handle clicks outside wallet dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(event.target as Node)) {
        setWalletDropdownOpen(false);
      }
      
      if (walletDetailsRef.current && !walletDetailsRef.current.contains(event.target as Node)) {
        setWalletDetailsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check for previous authentication
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = sessionStorage.getItem('medid_authenticated');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
        
        // Retrieve wallet address if available
        const savedAddress = sessionStorage.getItem('medid_wallet_address');
        if (savedAddress) {
          setWalletAddress(savedAddress);
        }
      }
    }
  }, []);
  
  // Fetch wallet balance when connected
  useEffect(() => {
    async function fetchWalletBalance() {
      if (wallet && connected) {
        try {
          const lovelace = await wallet.getLovelace();
          // Convert lovelace (millionths of ADA) to ADA
          const adaBalance = (parseInt(lovelace) / 1000000).toFixed(2);
          setWalletBalance(adaBalance);
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
        }
      }
    }
    
    if (connected) {
      fetchWalletBalance();
      // Refresh balance every 30 seconds
      const intervalId = setInterval(fetchWalletBalance, 30000);
      return () => clearInterval(intervalId);
    }
  }, [wallet, connected]);

  // Authentication logic when wallet connects
  useEffect(() => {
    async function authenticateWallet() {
      if (wallet && connected && !isProcessing && !isAuthenticated && !hasAttemptedAuth) {
        setIsProcessing(true);
        setHasAttemptedAuth(true);
        
        try {
          // Get wallet address
          const addr = await wallet.getChangeAddress();
          setWalletAddress(addr);
          
          // Generate and verify nonce
          const nonce = generateNonce(
            'Welcome to MedID - Secure your medical records on blockchain'
          );
          
          console.log('Requesting user signature...');
          
          // Add error handling and retry logic for signing
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
                  console.warn(`Signature verification failed. Retrying ${retryCount}/3...`);
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }
            } catch (signError) {
              console.error('Error when signing message:', signError);
              retryCount++;
              if (retryCount < 3) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              } else {
                throw signError;
              }
            }
          }
          
          if (!isValid) {
            console.error('Signature verification failed after multiple attempts');
            alert('Signature verification failed. Please try again later.');
            setIsProcessing(false);
            setHasAttemptedAuth(false);
            return;
          }
          
          console.log('Signature verification successful!');

          // Authentication successful, now get pubKey and save user info
          const { pubKeyHash } = deserializeAddress(addr);
          
          // Create did_number by encrypting wallet address
          const encryptionKey = "00000000";
          const did_number = encryptData(addr, encryptionKey);
          
          console.log('Saving user information...');
          console.log('Wallet address:', addr);
          console.log('PubKey:', pubKeyHash);
          console.log('DID Number:', did_number);
          
          try {
            // Check if user already exists in database
            const existingDid = await checkUserInDatabase(addr, pubKeyHash);
            
            if (existingDid === null) {
              // If not, save new to database
              console.log("User doesn't exist, creating new...");
              try {
                const userId = await saveUserToDatabase(addr, pubKeyHash, did_number);
                console.log('New user info saved successfully!', { userId, did_number });
                
                // Save DID to session storage
                sessionStorage.setItem('medid_did_number', did_number);
              } catch (saveError) {
                console.error("Error saving new user:", saveError);
                // Still continue and save DID
                sessionStorage.setItem('medid_did_number', did_number);
              }
            } else {
              console.log('User already exists with DID:', existingDid);
              // Save existing DID to session storage
              sessionStorage.setItem('medid_did_number', existingDid);
            }
          
            // Save authentication state and wallet address
            sessionStorage.setItem('medid_authenticated', 'true');
            sessionStorage.setItem('medid_wallet_address', addr);
            
            setIsAuthenticated(true);
            console.log('Wallet connected and authenticated successfully!');
            
            // Navigate when authentication is successful
            router.push('/did/verifyyourdid');
          } catch (dbError) {
            console.error('Error working with database:', dbError);
            
            // Still authenticate successfully but notify about database error
            alert(`Authentication successful but error saving information: ${dbError}. Data will only be saved locally.`);
            
            // Save information to session for user to still use the application
            sessionStorage.setItem('medid_authenticated', 'true');
            sessionStorage.setItem('medid_wallet_address', addr);
            sessionStorage.setItem('medid_did_number', did_number);
            
            setIsAuthenticated(true);
            router.push('/did/verifyyourdid');
          }
        } catch (error) {
          console.error('Wallet authentication error:', error);
          alert(
            'Wallet connection error: ' +
              (error instanceof Error ? error.message : String(error))
          );
          setIsAuthenticated(false);
          setHasAttemptedAuth(false);
        } finally {
          setIsProcessing(false);
        }
      } else if (!connected) {
        // Reset when wallet disconnected
        setIsAuthenticated(false);
        setHasAttemptedAuth(false);
        sessionStorage.removeItem('medid_authenticated');
        sessionStorage.removeItem('medid_wallet_address');
        sessionStorage.removeItem('medid_did_number');
        setWalletAddress('');
      }
    }

    authenticateWallet();
  }, [wallet, connected, router, isProcessing, isAuthenticated, hasAttemptedAuth]);

  // Handle manual wallet connection
  const handleConnectWallet = () => {
    setWalletDropdownOpen(!walletDropdownOpen);
    setHasAttemptedAuth(false);
  };
  
  // Copy wallet address to clipboard
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Address copied to clipboard");
  };
  
  // View address in explorer
  const viewInExplorer = () => {
    window.open(`https://preprod.cardanoscan.io/address/${walletAddress}`, "_blank");
  };
  
  // Handle wallet disconnect
  const handleDisconnect = () => {
    disconnect();
    setIsAuthenticated(false);
    setHasAttemptedAuth(false);
    sessionStorage.removeItem('medid_authenticated');
    sessionStorage.removeItem('medid_wallet_address');
    sessionStorage.removeItem('medid_did_number');
    setWalletAddress('');
    setWalletDetailsOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerContent}`}>
        <div className={styles.logo}>MedID</div>
        <div className={styles.navigation}>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/" className={styles.navLink}>Home</Link>
            </li>
            <li>
              <Link href="/service/adapter" className={styles.navLink}>Services</Link>
            </li>
            <li>
              <Link href="/blockchain-health" className={styles.navLink}>Blockchain Health</Link>
            </li>
            <li>
              <Link href="/doctor_service" className={styles.navLink}>Doctor Services</Link>
            </li>
          </ul>
        </div>
        <div className={styles.walletContainer}>
          {connected && isAuthenticated ? (
            <div className={styles.walletDetails} ref={walletDetailsRef}>
              <button 
                className={styles.walletButton} 
                onClick={() => setWalletDetailsOpen(!walletDetailsOpen)}
              >
                <div className={styles.walletIndicator}></div>
                <span className={styles.walletAddressShort}>
                  {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : name}
                </span>
                <ChevronDown className={styles.walletIcon} />
              </button>
              
              {walletDetailsOpen && (
                <div className={styles.walletDropdown}>
                  <div className={styles.walletHeader}>
                    <div className={styles.walletHeaderTitle}>Your Wallet</div>
                    <div className={styles.walletType}>{name}</div>
                  </div>
                  
                  <div className={styles.walletBalance}>
                    <span>{walletBalance} ₳</span>
                  </div>
                  
                  <div className={styles.walletContent}>
                    <div className={styles.walletAddressSection}>
                      <div className={styles.sectionTitle}>Wallet Address</div>
                      <div className={styles.addressContainer}>
                        <div className={styles.address}>{walletAddress}</div>
                        <button 
                          onClick={copyAddressToClipboard}
                          className={styles.addressButton}
                          title="Copy address"
                        >
                          <Copy className={styles.buttonIcon} />
                        </button>
                        <button 
                          onClick={viewInExplorer}
                          className={styles.addressButton}
                          title="View in explorer"
                        >
                          <ExternalLink className={styles.buttonIcon} />
                        </button>
                      </div>
                    </div>
                    
                    <button className={styles.disconnectButton} onClick={handleDisconnect}>
                      <LogOut className={styles.buttonIcon} />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.connectWalletContainer} ref={walletDropdownRef}>
              {isProcessing && (
                <span className={styles.processingStatus}>⟳ Processing...</span>
              )}
              
              <button 
                className={styles.connectWalletButton} 
                onClick={handleConnectWallet}
                disabled={isProcessing}
              >
                Connect Wallet
              </button>
              
              {walletDropdownOpen && (
                <div className={styles.walletListDropdown}>
                  {wallets.map((wallet, index) => (
                    <div
                      key={index}
                      className={styles.walletOption}
                      onClick={async () => {
                        await connect(wallet.name);
                        setWalletDropdownOpen(false);
                      }}
                    >
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className={styles.walletIcon}
                      />
                      <span>{wallet.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;