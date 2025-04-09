import React from 'react';
import { useWallet } from '@meshsdk/react';
import styles from '../styles/index.module.css';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerContent}`}>
        <div className={styles.logo}>MediCare Blockchain</div>
        <div className={styles.navigation}>
          <ul className={styles.navLinks}>
            <li><a href="#">Home</a></li>
            <li><a href="/hoso">Services</a></li>
            <Link href="/Hoso"><li>Ho so</li></Link>
            <li><a href="#">Blockchain Health</a></li>
          </ul>
          <button className={styles.connectBtn}>Connect</button>
        </div>
      </div>
    </header>
  );
}

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>Smart Healthcare on Blockchain</h1>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <p>Combining cutting-edge technology with blockchain to deliver secure and intelligent healthcare services</p>
            <div className={styles.buttons}>
              <button className={styles.primaryBtn}>Schedule Appointment</button>
              <button className={styles.secondaryBtn}>Blockchain Consultation</button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.blockchainVisual}>
              <div className={styles.block}>Block #1</div>
              <span className={styles.arrow}>→</span>
              <div className={styles.block}>Block #2</div>
              <span className={styles.arrow}>→</span>
              <div className={styles.block}>Block #3</div>
              <span className={styles.arrow}>→</span>
              <div className={styles.block}>Block #n</div>
            </div>
            <p className={styles.infoText}>Medical records are encrypted</p>
            <p className={styles.infoText}>Data is securely stored and centrally accessible</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Applications: React.FC = () => {
  return (
    <section className={styles.applications}>
      <div className={styles.container}>
        <h2 className={styles.subtitle}>Blockchain Applications in Healthcare</h2>
        <div className={styles.appGrid}>
          <div className={styles.appCard}>
            <div className={`${styles.appIcon} ${styles.positive}`}>+</div>
            <div>Centralized Medical Records</div>
          </div>
          <div className={styles.appCard}>
            <div className={`${styles.appIcon} ${styles.negative}`}>×</div>
            <div>Medical Identity Management</div>
          </div>
          <div className={styles.appCard}>
            <div className={`${styles.appIcon} ${styles.positive}`}>+</div>
            <div>Secure Payment Solutions</div>
          </div>
          <div className={styles.appCard}>
            <div className={`${styles.appIcon} ${styles.negative}`}>×</div>
            <div>Medication Management</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WalletSection: React.FC = () => {
  const { connect, disconnect, wallet, connected } = useWallet();

  const wallets = [
    { name: 'MetaMask', icon: 'M', id: 'metamask', class: 'metaIcon' },
    { name: 'WalletConnect', icon: 'W', id: 'walletconnect', class: 'walletConnectIcon' },
    { name: 'Coinbase Wallet', icon: 'CB', id: 'coinbase', class: 'coinbaseIcon' },
    { name: 'MediCoin Wallet', icon: 'M', id: 'medicoin', class: 'medicoinIcon' },
  ];

  return (
    <section className={styles.walletSection}>
      <div className={styles.container}>
        <h2 className={styles.subtitle}>Connect Your Blockchain Wallet</h2>
        <p style={{ textAlign: 'center', marginBottom: '30px' }}>
          Connect your wallet to securely provide medical records and use centralized services
        </p>
        <div className={styles.walletContainer}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Choose Connection Method</h3>
          <div className={styles.walletOptions}>
            {wallets.map((w) => (
              <div
                key={w.id}
                className={styles.walletCard}
                onClick={() => !connected && connect(w.id)}
              >
                <div className={`${styles.walletIcon} ${styles[w.class]}`}>{w.icon}</div>
                <div>{w.name}</div>
              </div>
            ))}
          </div>
          {connected && (
            <button onClick={disconnect} className={styles.disconnectBtn}>
              Disconnect Wallet
            </button>
          )}
          <p className={styles.walletNote}>
            Your data will be encrypted and securely stored on the blockchain
          </p>
        </div>
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Applications />
      <WalletSection />
    </div>
  );
};

export default HomePage;