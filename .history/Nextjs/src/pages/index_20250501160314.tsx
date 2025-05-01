import React from 'react';
import { useWallet } from '@meshsdk/react';
import { Database, Lock, CreditCard, Pill } from 'lucide-react';
import styles from '../styles/index.module.css';

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start', // Đưa chữ sang trái
          alignItems: 'center',
          minHeight: '70vh',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            maxWidth: 600,
            marginLeft: '7vw', // Đổi sang marginLeft
            color: '#fff',
            textAlign: 'left', // Đổi sang left
            padding: '40px 0',
            background: 'none',
            boxShadow: 'none',
            borderRadius: 0,
          }}
        >
          <h1
            style={{
              fontSize: 44,
              fontWeight: 900,
              marginBottom: 24,
              color: '#fff',
              letterSpacing: 1,
              textShadow: '0 4px 32px rgba(10,20,40,0.25), 0 1px 0 #222',
              lineHeight: 1.15,
              margin: 0,
              padding: 0,
              wordBreak: 'break-word',
              maxWidth: 600,
              whi
            }}
          >
            Empowering Healthcare with Secure Digital Records
          </h1>
          <p
            style={{
              fontSize: 20,
              color: '#e0f7fa',
              marginBottom: 32,
              lineHeight: 1.6,
              fontWeight: 500,
              textShadow: '0 2px 12px rgba(10,20,40,0.25)',
            }}
          >
            Modern healthcare meets technology.<br />
            Manage, share, and protect your medical data with confidence.<br />
            Blockchain ensures privacy, transparency, and accessibility for every patient and provider.
          </p>
          <div className={styles.buttons} style={{ justifyContent: 'flex-start' }}>
            <button className={styles.primaryBtn}>Book a Consultation</button>
            <button className={styles.secondaryBtn}>Learn More</button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Applications: React.FC = () => {
  const apps = [
    {
      icon: <Database className={`${styles.appIcon} ${styles.animatePulse}`} />,
      title: 'Centralized Medical Records',
      description: 'Securely store and access patient data on the blockchain.',
    },
    {
      icon: <Lock className={`${styles.appIcon} ${styles.animatePulse}`} />,
      title: 'Medical Identity Management',
      description: 'Protect patient identities with decentralized verification.',
    },
    {
      icon: <CreditCard className={`${styles.appIcon} ${styles.animatePulse}`} />,
      title: 'Secure Payment Solutions',
      description: 'Fast, transparent healthcare payments via smart contracts.',
    },
    {
      icon: <Pill className={`${styles.appIcon} ${styles.animatePulse}`} />,
      title: 'Medication Management',
      description: 'Track and verify medications to prevent fraud.',
    },
  ];

  return (
    <section className={styles.applications}>
      <div className={styles.container}>
        <h2 className={styles.subtitle}>Blockchain Applications in Healthcare</h2>
        <div className={styles.appGrid}>
          {apps.map((app, index) => (
            <div key={index} className={styles.appCard}>
              <div className={styles.iconWrapper}>{app.icon}</div>
              <h3 className={styles.appTitle}>{app.title}</h3>
              <p className={styles.appDescription}>{app.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WalletSection: React.FC = () => {
  const { connect, disconnect, connected } = useWallet();

  const wallets = [
    {
      name: 'MetaMask',
      icon: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/metamask-icon.svg',
      id: 'metamask',
    },
    {
      name: 'WalletConnect',
      icon: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
      id: 'walletconnect',
    },
    {
      name: 'Coinbase Wallet',
      icon: 'https://avatars.githubusercontent.com/u/18060234?s=200&v=4',
      id: 'coinbase',
    },
    {
      name: 'MediCoin Wallet',
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNGh4yLk1BeLRe3H79wP2TLoy-mr-kZp-jTw&s',
      id: 'medicoin',
    },
    {
      name: 'Eternl',
      icon: 'data:image/jpeg;base64,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',
      id: 'eternl',
    },
    {
      name: 'Yoroi',
      icon: 'https://play-lh.googleusercontent.com/UlhGKCVtUuXjDDF_fFdDQaF7mdUpMpsKvfQNNQHuwzbNEvvN-sYRNLk308wpWmLQkR4=w240-h480-rw',
      id: 'yoroi',
    },
  ];

  return (
    <section className={styles.walletSection}>
      <div className={styles.container}>
        <h2 className={styles.subtitle}>Connect Your Blockchain Wallet</h2>
        <p className={styles.walletDescription}>
          Connect your wallet to securely provide medical records and use centralized services
        </p>
        <div className={styles.walletContainer}>
          <h3 className={styles.walletSubtitle}>Choose Connection Method</h3>
          <div className={styles.walletOptions}>
            {wallets.map((w) => (
              <div
                key={w.id}
                className={styles.walletCard}
                onClick={() => !connected && connect(w.id)}
              >
                <img
                  src={w.icon}
                  alt={`${w.name} icon`}
                  className={styles.walletIcon}
                />
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
    <div className={styles.pageWrapper}>
      <Hero />
      <Applications />
      <WalletSection />
    </div>
  );
};

export default HomePage;