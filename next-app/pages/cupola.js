import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import ISSMap from '../components/ISSMap';
import { useState, useEffect } from 'react';
import styles from '../styles/Cupola.module.css';

export default function Cupola() {
  const [currentImage, setCurrentImage] = useState(null);
  const [infoCard, setInfoCard] = useState(null);
  const [issPosition, setISSPosition] = useState(null);

  // Simulate loading Earth imagery
  useEffect(() => {
    // In a real app, this would fetch from NASA API
    const mockImage = {
      url: 'https://epic.gsfc.nasa.gov/archive/natural/2023/08/02/png/epic_1b_20230802003912.png',
      title: 'Earth from Space',
      description: 'Beautiful view of Earth from the International Space Station',
      location: { latitude: 25.7617, longitude: -80.1918 }
    };
    setCurrentImage(mockImage);
  }, []);

  // Simulate ISS position for the map
  useEffect(() => {
    const mockISS = {
      latitude: 25.7617,
      longitude: -80.1918
    };
    setISSPosition(mockISS);
  }, []);

  const hotspots = [
    { id: 1, x: 30, y: 40, title: 'City Lights', description: 'City lights at night help scientists study human activity patterns' },
    { id: 2, x: 60, y: 30, title: 'Deforestation', description: 'Deforestation visible from orbit aids climate research' },
    { id: 3, x: 45, y: 60, title: 'Weather Patterns', description: 'Cloud formations help meteorologists predict weather' }
  ];

  const handleHotspotClick = (hotspot) => {
    setInfoCard(hotspot);
  };

  return (
    <Layout>
      <Head>
        <title>Cupola Experience - Orbitra</title>
        <meta name="description" content="Experience Earth from the ISS Cupola" />
      </Head>

      <main className={styles.main}>
        <div className={styles.cupolaContainer}>
          <h1 className={styles.title}>🌍 Cupola Earth View</h1>
          
          <div className={styles.mapSection}>
            <h2>ISS Current Position</h2>
            <div className={styles.mapContainer}>
              {issPosition && <ISSMap issPosition={issPosition} />}
            </div>
          </div>
          
          <div className={styles.cupolaWindow}>
            {currentImage ? (
              <div className={styles.earthView}>
                <img 
                  src={currentImage.url} 
                  alt={currentImage.title} 
                  className={styles.earthImage}
                />
                
                {hotspots.map((hotspot) => (
                  <div
                    key={hotspot.id}
                    className={styles.hotspot}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    onClick={() => handleHotspotClick(hotspot)}
                  >
                    <div className={styles.hotspotIndicator}></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.loading}>Loading Earth view...</div>
            )}
          </div>
          
          {infoCard && (
            <div className={styles.infoCard}>
              <h3>{infoCard.title}</h3>
              <p>{infoCard.description}</p>
              <button onClick={() => setInfoCard(null)}>Close</button>
            </div>
          )}
          
          <div className={styles.controls}>
            <Link href="/" className={styles.navButton}>
              ← Back
            </Link>
            <Link href="/nbl" className={styles.navButton}>
              Next →
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}