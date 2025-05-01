import React from "react";
import Link from 'next/link';
import styles from '../../styles/adapter_doctor.module.css';

const DoctorServices = () => {
  // Core features for the streamlined record management section
  const coreFeatures = [
    {
      title: 'Unlock Records',
      description: 'Quick and secure access to patient records when needed',
      detailedDescription: 'Two-factor authentication ensures only authorized personnel can unlock and access patient records, with detailed access logs for compliance.',
      icon: '🔓',
    },
    {
      title: 'Lock Records',
      description: 'Protect patient information with secure locking system',
      detailedDescription: 'Automatic record locking after use and access history tracking to ensure the highest level of security and HIPAA compliance.',
      icon: '🔒',
      popular: true,
    },
    {
      title: 'Update Records',
      description: 'Update patient information quickly and accurately',
      detailedDescription: 'User-friendly interface helps doctors easily update patient information, test results, and treatment plans with version history.',
      icon: '🔄',
    },
  ];

  // Advanced features section
  const advancedFeatures = [
    {
      title: 'Smart Search',
      description: 'AI-powered search functionality allows you to quickly find patient records using natural language queries.',
      icon: '🔍',
    },
    {
      title: 'Notification System',
      description: 'Receive alerts for critical updates, pending approvals, and important patient information changes.',
      icon: '🔔',
    },
    {
      title: 'Enterprise-Grade Security',
      description: 'End-to-end encryption and compliance with international medical security standards and regulations.',
      icon: '🛡️',
    },
  ];

  // Supplementary features
  const supplementaryFeatures = [
    {
      title: 'Appointment Scheduling',
      description: 'Integrated calendar system with automated reminders to reduce no-shows and optimize your schedule.',
      icon: '📅',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics to track patient outcomes, practice efficiency, and identify improvement opportunities.',
      icon: '📊',
    },
    {
      title: 'Collaboration Tools',
      description: 'Secure messaging and file sharing between healthcare providers for better coordinated care.',
      icon: '👥',
    },
    {
      title: 'Automated Workflows',
      description: 'Streamline repetitive tasks with customizable workflows that save time and reduce errors.',
      icon: '⏱️',
    },
    {
      title: 'Compliance Management',
      description: 'Stay up-to-date with regulatory requirements and automate compliance reporting.',
      icon: '✓',
    },
    {
      title: 'Document Management',
      description: 'Organize, store, and retrieve patient documents efficiently in a centralized system.',
      icon: '📄',
    },
  ];

  // Pricing plans
  const pricingPlans = [
    {
      title: 'Basic Plan',
      description: 'Perfect for individual practitioners with core record management features.',
      icon: '✓',
    },
    {
      title: 'Professional Plan',
      description: 'Ideal for small practices with advanced features and priority support.',
      icon: '✓',
    },
    {
      title: 'Enterprise Plan',
      description: 'Comprehensive solution for large healthcare organizations with custom integrations.',
      icon: '✓',
    },
  ];

  // Statistics
  const statistics = [
    {
      value: '5,000+',
      label: 'Active Physicians',
      icon: '👤',
    },
    {
      value: '1M+',
      label: 'Records Managed',
      icon: '📄',
    },
    {
      value: '98%',
      label: 'Satisfaction Rate',
      icon: '📊',
    },
    {
      value: '5+ Years',
      label: 'Industry Experience',
      icon: '📅',
    },
  ];

  return (

      {/* Main Features Section */}
      <section className={styles.mainFeatures}>
        <div className={styles.tagBadge}>Trusted by 5,000+ Healthcare Professionals</div>
        <div className={styles.mainFeaturesFlex}>
          <div className={styles.mainFeaturesContent}>
            <h2>Secure Medical Records Management for Modern Healthcare</h2>
            <p className={styles.featureDescription}>
              A comprehensive solution that helps doctors manage patient records efficiently, securely, and conveniently, allowing you to focus on what matters most—patient care.
            </p>
            <div className={styles.featureButtons}>
              <button className={styles.startFreeTrial}>Start Free Trial</button>
              <button className={styles.scheduleDemo}>Schedule Demo →</button>
            </div>
            <div className={styles.rating}>
              <div className={styles.stars}></div>
              <span>4.9/5 from over 1,200 reviews</span>
            </div>
          </div>
          <div className={styles.mainFeaturesImageWrapper}>
            <img
              src="https://3.bp.blogspot.com/-9f4JANi03zA/WbIuJFXKNsI/AAAAAAAAADI/ABm1Uu6ncH4AEkPLRYW-PawnT6qbpC5JQCLcBGAs/s1600/Medical+records.jpg"
              alt="Medical Records"
              className={styles.mainFeaturesImage}
            />
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className={styles.coreFeatures}>
        <div className={styles.sectionTag}>Core Features</div>
        <h2>Streamlined Record Management</h2>
        <p>Our system provides all the essential tools to manage patient records securely and efficiently, with a focus on privacy and compliance.</p>
        
        <div className={styles.featureCards}>
          {coreFeatures.map((feature, index) => (
            <div className={styles.featureCard} key={index}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.featureIcon}>{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <p className={styles.detailedDescription}>{feature.detailedDescription}</p>
              {feature.popular && <div className={styles.popularTag}>Most Popular</div>}
              <button className={styles.learnMoreButton}>Learn More</button>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className={styles.advancedFeatures}>
        <div className={styles.sectionTag}>Advanced Features</div>
        <h2>Beyond Basic Record Management</h2>
        <p>Our comprehensive solution helps doctors focus on patient care rather than worrying about record management, with advanced features designed for modern healthcare.</p>
        
        <div className={styles.featureList}>
          {advancedFeatures.map((feature, index) => (
            <div className={styles.featureItem} key={index}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.featureIcon}>{feature.icon}</span>
              </div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supplementary Features Section */}
      <section className={styles.supplementaryFeatures}>
        <div className={styles.sectionTag}>Supplementary Features</div>
        <h2>Complete Healthcare Ecosystem</h2>
        <p>Beyond core record management, our platform offers a suite of integrated tools to streamline your entire practice</p>
        
        <div className={styles.featureGrid}>
          {supplementaryFeatures.map((feature, index) => (
            <div className={styles.featureGridItem} key={index}>
              <div className={styles.featureIconWrapper}></div>
                <span className={styles.featureIcon}>{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Preview Section */}
      <section className={styles.platformPreview}>
        <div className={styles.sectionTag}>Platform Preview</div>
        <h2>See MedRecord Pro in Action</h2>
        <p>Explore the key features of our platform through our interactive demo</p>
        
        <div className={styles.demoTabs}>
          <button className={styles.demoTabActive}>Record Management</button>
          <button className={styles.demoTab}>Analytics</button>
          <button className={styles.demoTab}>Scheduling</button>
        </div>
        
        <div className={styles.demoPreview}>
          {/* Demo content will go here */}
        </div>
      </section>

      {/* Trust Section */}
      <section className={styles.trustSection}>
        <h2>Trusted by Healthcare Leaders</h2>
        <p>Our system has helped thousands of healthcare professionals improve their workflows</p>
        
        <div className={styles.statsGrid}>
          {statistics.map((stat, index) => (
            <div className={styles.statCard} key={index}>
              <div className={styles.statIconWrapper}></div>
                <span className={styles.statIcon}>{stat.icon}</span>
              </div>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricingSection}>
        <div className={styles.sectionTag}>Flexible Pricing</div>
        <h2>Plans That Scale With Your Practice</h2>
        <p>Whether you're a solo practitioner or a large healthcare organization, we have pricing options designed to fit your needs and budget.</p>
        
        <div className={styles.plansList}>
          {pricingPlans.map((plan, index) => (
            <div className={styles.planItem} key={index}>
              <div className={styles.planIconWrapper}>
                <span className={styles.planIcon}>{plan.icon}</span>
              </div>
              <div>
                <h3>{plan.title}</h3>
                <p>{plan.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.pricingButtons}>
          <button className={styles.viewPricing}>View Pricing Details</button>
          <button className={styles.contactSales}>Contact Sales</button>
        </div>
      </section>
    </div>
  );
};

export default DoctorServices;