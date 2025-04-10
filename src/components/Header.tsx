
import styles from './Header.module.css';
import Link from 'next/link';
const Header = () => {
    return (
        <header className={styles.header}>
            <div className={`${styles.container} ${styles.headerContent}`}>
                <div className={styles.logo}>MediCare Blockchain</div>
                <div className={styles.navigation}>
                    <ul className={styles.navLinks}>
                        <li><a href="#">Home</a></li>
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
                    </ul>
                    <button className={styles.connectBtn}>Connect</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
