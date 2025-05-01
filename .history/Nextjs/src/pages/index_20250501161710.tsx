import React from 'react';
import { useWallet } from '@meshsdk/react';
import styles from '../styles/index.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          minHeight: '70vh',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            maxWidth: 600,
            marginLeft: '7vw',
            textAlign: 'left',
            padding: '40px 0',
            background: 'none',
            boxShadow: 'none',
            borderRadius: 0,
          }}
        >
          <h1>
            Empowering Healthcare <br />
            With Secure Digital
            <br />Records
          </h1>
          <p>
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

export default Hero;