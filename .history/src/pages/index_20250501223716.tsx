import React from 'react';
import styles from '../styles/index.module.css';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1>
              Empowering Healthcare<br />
              With Secure Digital<br />
              Records
            </h1>
            <p>
              Modern healthcare meets technology.
              Manage, share, and protect your medical data with confidence.
              Blockchain ensures privacy, transparency, and accessibility for every patient and provider.
            </p>
            <div className={styles.buttons}>
              <button className={styles.primaryBtn}>Book a Consultation</button>
              <button className={styles.secondaryBtn}>Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2>Why Choose Our Platform</h2>
          <p className={styles.sectionDesc}>Experience the future of healthcare record management with these key benefits</p>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3>Secure Storage</h3>
              <p>Your medical data is encrypted and stored securely on blockchain, ensuring only authorized access.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
              </div>
              <h3>Seamless Sharing</h3>
              <p>Share your medical records with healthcare providers instantly with controlled access permissions.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3>Complete History</h3>
              <p>Maintain your entire medical history in one place with immutable records that cannot be altered.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4l3 3"></path>
                </svg>
              </div>
              <h3>Real-time Updates</h3>
              <p>Get instant access to your latest medical reports, prescriptions, and doctor&apos;s notes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2>How It Works</h2>
          <p className={styles.sectionDesc}>Our simple three-step process makes healthcare record management effortless</p>
          
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Register Your Account</h3>
              <p>Create your secure personal profile with verified identity to ensure maximum security.</p>
            </div>
            
            <div className={styles.stepConnect}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Upload Medical Records</h3>
              <p>Import your existing medical records or connect with healthcare providers to sync automatically.</p>
            </div>
            
            <div className={styles.stepConnect}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Manage & Share</h3>
              <p>Control who can access your records and for how long, with detailed activity tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2>What Our Users Say</h2>
          <p className={styles.sectionDesc}>Real experiences from patients and healthcare providers using our platform</p>
          
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.quote}>&quot;</div>
              <p>As a doctor, having instant access to my patients&apos; complete medical history has revolutionized how I provide care. The security features give everyone peace of mind.</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  {/* Image placeholder for doctor avatar */}
                  <div className={styles.avatarPlaceholder}>DR</div>
                </div>
                <div>
                  <h4>Dr. Robert Chen</h4>
                  <p>Cardiologist, Heart Health Center</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.quote}>&quot;</div>
              <p>Managing my family&apos;s medical records used to be a nightmare. Now with this platform, I can access everything from prescriptions to lab results in seconds, even during emergencies.</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  {/* Image placeholder for patient avatar */}
                  <div className={styles.avatarPlaceholder}>SM</div>
                </div>
                <div>
                  <h4>Sarah Miller</h4>
                  <p>Patient & Mother of Three</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.quote}>&quot;</div>
              <p>The blockchain technology ensures that our hospital&apos;s records remain tamper-proof and fully compliant with regulations. It&apos;s transformed our administrative efficiency.</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  {/* Image placeholder for hospital admin avatar */}
                  <div className={styles.avatarPlaceholder}>JW</div>
                </div>
                <div>
                  <h4>James Wilson</h4>
                  <p>Hospital Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Transform Your Healthcare Experience?</h2>
            <p>Join thousands of patients and healthcare providers who are already benefiting from our secure digital medical record platform.</p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryBtn}>Get Started Today</button>
              <button className={styles.secondaryBtn}>Schedule a Demo</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;