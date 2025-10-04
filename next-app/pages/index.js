import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../styles/Landing.module.css';

export default function Landing() {
  return (
    <Layout>
      <Head>
        <title>Orbitra - From Space to Earth</title>
        <meta name="description" content="Experience the International Space Station's 25-year journey" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.landingContainer}>
          <div className={styles.stars}></div>
          <div className={styles.earthOrbit}></div>
          
          <div className={styles.content}>
            <h1 className={styles.title}>
              From Space to Earth: <br />
              <span>What Astronauts See & Train For</span>
            </h1>
            
            <p className={styles.description}>
              Embark on a journey through the International Space Station's 25 years of discovery
            </p>
            
            <Link href="/cupola" className={styles.startButton}>
              Start Experience
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}