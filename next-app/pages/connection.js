import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../styles/Connection.module.css';

export default function Connection() {
  return (
    <Layout>
      <Head>
        <title>Connection - Orbitra</title>
        <meta name="description" content="Connecting space observations and Earth benefits" />
      </Head>

      <main className={styles.main}>
        <div className={styles.connectionContainer}>
          <h1 className={styles.title}>🔗 Bridging Space & Earth</h1>
          
          <div className={styles.connectionContent}>
            <div className={styles.leftSection}>
              <h2>🌍 Cupola Experience</h2>
              <p>Observing Earth from the ISS Cupola provides valuable data about our planet.</p>
              <div className={styles.earthCard}>
                <div className={styles.earthIcon}>🌎</div>
                <div className={styles.dataPoints}>
                  <div className={styles.dataPoint}>Climate Research</div>
                  <div className={styles.dataPoint}>Weather Prediction</div>
                  <div className={styles.dataPoint}>Environmental Monitoring</div>
                </div>
              </div>
            </div>
            
            <div className={styles.connectionArrow}>
              <div className={styles.arrow}>🔄</div>
              <div className={styles.arrowText}>COMBINES WITH</div>
            </div>
            
            <div className={styles.rightSection}>
              <h2>🏊 NBL Training</h2>
              <p>Training in the Neutral Buoyancy Lab develops technologies with Earth applications.</p>
              <div className={styles.nblCard}>
                <div className={styles.nblIcon}>🤖</div>
                <div className={styles.techPoints}>
                  <div className={styles.techPoint}>Robotics</div>
                  <div className={styles.techPoint}>Precision Tools</div>
                  <div className={styles.techPoint}>Medical Devices</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.resultSection}>
            <h2>🚀 Result: Earth Benefits</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🏥</div>
                <h3>Medical Advances</h3>
                <p>Astronaut training and space research lead to improved medical devices and procedures</p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🌱</div>
                <h3>Environmental Solutions</h3>
                <p>Earth observations help us understand and address climate change</p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🔧</div>
                <h3>Technology Transfer</h3>
                <p>Space technologies adapted for terrestrial use</p>
              </div>
            </div>
          </div>
          
          <div className={styles.controls}>
            <Link href="/nbl" className={styles.navButton}>
              ← Back
            </Link>
            <Link href="/summary" className={styles.navButton}>
              Next →
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}