import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            🌍 Orbitra
          </Link>
          
          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/cupola" className={styles.navLink}>Cupola</Link>
            <Link href="/nbl" className={styles.navLink}>NBL</Link>
            <Link href="/connection" className={styles.navLink}>Connection</Link>
            <Link href="/summary" className={styles.navLink}>Summary</Link>
            <Link href="/final" className={styles.navLink}>About</Link>
          </nav>
          
          <button className={styles.menuButton} onClick={toggleMenu}>
            ☰
          </button>
        </div>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        <p>&copy; 2024 Orbitra | Celebrating 25 Years of the International Space Station</p>
      </footer>
    </div>
  );
}