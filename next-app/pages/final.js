import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../styles/Final.module.css';

export default function Final() {
  return (
    <Layout>
      <Head>
        <title>Thank You - Orbitra</title>
        <meta name="description" content="Thank you for experiencing Orbitra" />
      </Head>

      <main className={styles.main}>
        <div className={styles.finalContainer}>
          <h1 className={styles.title}>Thank You</h1>
          
          <div className={styles.quoteSection}>
            <div className={styles.quoteIcon}>❝</div>
            <blockquote className={styles.quote}>
              "When we look at Earth from space, we realize we are all connected. 
              The knowledge gained from space research and astronaut training 
              helps us address challenges here on our home planet."
            </blockquote>
            <cite className={styles.citation}>— Astronaut's Perspective</cite>
          </div>
          
          <div className={styles.ctaSection}>
            <h2>Continue Your Journey</h2>
            <div className={styles.ctaButtons}>
              <a 
                href="https://www.nasa.gov/mission_pages/station/main/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.learnMoreButton}
              >
                Learn More →
              </a>
              <Link href="/" className={styles.replayButton}>
                Replay Experience →
              </Link>
            </div>
          </div>
          
          <div className={styles.statsSection}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>25</div>
              <div className={styles.statLabel}>Years of ISS</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>27,600</div>
              <div className={styles.statLabel}>km/h Speed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>408</div>
              <div className={styles.statLabel}>km Altitude</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>16</div>
              <div className={styles.statLabel}>Daily Orbits</div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}