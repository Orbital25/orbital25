import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import NBLGame from '../components/NBLGame';
import { useState } from 'react';
import styles from '../styles/NBL.module.css';

export default function NBL() {
  const [selectedTool, setSelectedTool] = useState(null);
  
  const tools = [
    {
      id: 1,
      name: 'Robotic Arm',
      description: 'Training here improves surgery robotics on Earth',
      benefit: 'This robotic technology has been adapted for minimally invasive surgeries'
    },
    {
      id: 2,
      name: 'Scientific Tool',
      description: 'This tool was later adapted for medical imaging',
      benefit: 'The precision mechanisms are now used in advanced diagnostic equipment'
    },
    {
      id: 3,
      name: 'ISS Component',
      description: 'Underwater training helps astronauts with spacewalks',
      benefit: 'Skills transfer to underwater construction and repair on Earth'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>NBL Training Simulator - Orbitra</title>
        <meta name="description" content="Experience astronaut training at the Neutral Buoyancy Lab" />
      </Head>

      <main className={styles.main}>
        <div className={styles.nblContainer}>
          <h1 className={styles.title}>🏊 Neutral Buoyancy Lab Training</h1>
          
          <div className={styles.gameSection}>
            <h2>Interactive Training Simulation</h2>
            <div className={styles.gameContainer}>
              <NBLGame />
            </div>
          </div>
          
          <div className={styles.toolsSection}>
            <h2>Training Equipment</h2>
            <div className={styles.toolsGrid}>
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className={`${styles.toolCard} ${selectedTool?.id === tool.id ? styles.selected : ''}`}
                  onClick={() => setSelectedTool(tool)}
                >
                  <div className={styles.toolIcon}>
                    {tool.id === 1 ? '🤖' : tool.id === 2 ? '🔬' : '🔧'}
                  </div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {selectedTool && (
            <div className={styles.infoPanel}>
              <h3>{selectedTool.name}</h3>
              <p>{selectedTool.description}</p>
              <p className={styles.benefit}><strong>Earth Benefit:</strong> {selectedTool.benefit}</p>
              <button onClick={() => setSelectedTool(null)}>Close</button>
            </div>
          )}
          
          <div className={styles.controls}>
            <Link href="/cupola" className={styles.navButton}>
              ← Back
            </Link>
            <Link href="/connection" className={styles.navButton}>
              Next →
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}