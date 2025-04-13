import styles from './Footer.module.css';

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            {[
              {
                title: 'About MedID',
                links: ['Our Mission', 'Blockchain Technology', 'Team', 'Partners']
              },
              {
                title: 'Services',
                links: ['For Doctors', 'For Patients', 'For Hospitals', 'For Laboratories']
              },
              {
                title: 'Support',
                links: ['Help Center', 'Contact Us', 'FAQs', 'Training & Resources']
              },
              {
                title: 'Legal',
                links: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Data Security']
              },
            ].map((section, index) => (
              <div className={styles.footerSection} key={index}>
                <h3>{section.title}</h3>
                <ul>
                  {section.links.map((link, i) => (
                    <li key={i}><a href="#">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025 MedID. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
