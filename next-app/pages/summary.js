import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useState } from 'react';
import styles from '../styles/Summary.module.css';

export default function Summary() {
  const [showDownload, setShowDownload] = useState(false);
  
  const infographicData = [
    {
      title: 'Cupola → Earth Data → Climate Insights',
      description: 'Observations from the ISS Cupola provide data on climate change, weather patterns, and environmental changes',
      icon: '🌍',
      stats: ['25 years of data', 'Daily global coverage', 'Early warning systems']
    },
    {
      title: 'NBL → Astronaut Skills → Earth Technology',
      description: 'Training in the Neutral Buoyancy Lab develops skills and technologies with applications on Earth',
      icon: '🤖',
      stats: ['Robotic surgery', 'Precision tools', 'Medical devices']
    }
  ];

  const handleDownload = () => {
    setShowDownload(true);
    // In a real app, this would trigger an actual download
    setTimeout(() => {
      setShowDownload(false);
    }, 2000);
  };

  return (
    <Layout>
      <Head>
        <title>Interactive Summary - Orbitra</title>
        <meta name="description" content="Interactive infographic of space benefits to Earth" />
      </Head>

      <main className={styles.main}>
        <div className={styles.summaryContainer}>
          <h1 className={styles.title}>📊 Interactive Summary</h1>
          
          <div className={styles.infographicContainer}>
            {infographicData.map((item, index) => (
              <div key={index} className={styles.infographicCard}>
                <div className={styles.icon}>{item.icon}</div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                
                <div className={styles.stats}>
                  {item.stats.map((stat, i) => (
                    <div key={i} className={styles.stat}>{stat}</div>
                  ))}
                </div>
                
                <div className={styles.flow}>
                  <div className={styles.flowItem}>Space Observation</div>
                  <div className={styles.arrow}>→</div>
                  <div className={styles.flowItem}>Data Analysis</div>
                  <div className={styles.arrow}>→</div>
                  <div className={styles.flowItem}>Earth Benefits</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.visualization}>
            <div className={styles.earthVisualization}>
              <div className={styles.earth}></div>
              <div className={styles.dataStreams}>
                <div className={styles.stream1}></div>
                <div className={styles.stream2}></div>
              </div>
            </div>
          </div>
          
          <div className={styles.downloadSection}>
            <h3>Share the Experience</h3>
            <button onClick={handleDownload} className={styles.downloadButton}>
              📥 Download Infographic
            </button>
            {showDownload && (
              <div className={styles.downloadNotification}>
                Infographic downloaded successfully!
              </div>
            )}
          </div>
          
          <div className={styles.controls}>
            <Link href="/connection" className={styles.navButton}>
              ← Back
            </Link>
            <Link href="/final" className={styles.navButton}>
              Next →
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}