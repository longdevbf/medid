import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@meshsdk/react';
import Image from 'next/image';
import defaultAvatar from '../../assets/default-avatar.jpg'; // Tạo file này
import styles from './User.module.css';

const UserProfile: React.FC = () => {
  const { connected, wallet } = useWallet();
  const router = useRouter();
  
  // User state
  const [userAvatar, setUserAvatar] = useState<string | StaticImport>(defaultAvatar);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [didNumber, setDidNumber] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState<string>('0');
  const [userAssets, setUserAssets] = useState<any[]>([]);

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const isAuthenticated = sessionStorage.getItem('medid_authenticated') === 'true';
        const storedAddress = sessionStorage.getItem('medid_wallet_address') || '';
        const storedDid = sessionStorage.getItem('medid_did_number') || '';
        
        setWalletAddress(storedAddress);
        setDidNumber(storedDid);
        
        if (!isAuthenticated) {
          router.push('/');
          return false;
        }
        return true;
      }
      return false;
    };
    
    const authenticated = checkAuth();
    if (!authenticated) return;
    
    // Load user data
    const fetchUserData = async () => {
      if (wallet && connected) {
        try {
          // Fetch wallet balance
          const lovelace = await wallet.getLovelace();
          const adaBalance = (parseInt(lovelace) / 1000000).toFixed(2);
          setWalletBalance(adaBalance);
          
          // Fetch assets
          const assets = await wallet.getAssets();
          setUserAssets(assets || []);
          
          // Here you would usually fetch user profile data from your backend
          // For now we'll just use the sample avatar
          
        } catch (error) {
          console.error("Error loading user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [wallet, connected, router]);

  // Allow user to upload a new avatar
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUserAvatar(reader.result);
          // Here you would usually upload this to your storage and update user profile
          // For now we'll just update locally
          // Later you can implement proper storage in IPFS or elsewhere
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  if (loading) {
    return <div className={styles.loadingContainer}>Loading user profile...</div>;
  }

  return (
    <div className={styles.userProfileContainer}>
      <div className={styles.profileHeader}>
        <h1>User Profile</h1>
      </div>
      
      <div className={styles.profileContent}>
        <div className={styles.profileSection}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <Image 
                src={userAvatar} 
                alt="User Avatar" 
                width={150} 
                height={150}
                className={styles.profileAvatar} 
              />
              <div className={styles.avatarUpload}>
                <label htmlFor="avatar-upload" className={styles.uploadButton}>
                  Change Photo
                </label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className={styles.fileInput}
                />
              </div>
            </div>
          </div>
          
          <div className={styles.userInfo}>
            <div className={styles.infoCard}>
              <h2>Identity Information</h2>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Wallet Address:</span>
                <span className={styles.infoValue}>{walletAddress}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>DID Number:</span>
                <span className={styles.infoValue}>{didNumber}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Balance:</span>
                <span className={styles.infoValue}>{walletBalance} ₳</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.assetsSection}>
          <h2>Your Assets</h2>
          {userAssets.length > 0 ? (
            <div className={styles.assetGrid}>
              {userAssets.map((asset, index) => (
                <div key={index} className={styles.assetCard}>
                  <h3>{asset.unit ? asset.unit.substring(0, 10) + '...' : 'Unknown Asset'}</h3>
                  <p>Quantity: {asset.quantity || 0}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No assets found in your wallet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;