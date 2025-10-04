// components/NBLGame.js
import { useEffect, useRef } from 'react';

export default function NBLGame() {
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    // Prevent multiple game instances
    if (gameInstanceRef.current) {
      return;
    }
    
    const initGame = async () => {
      // Dynamically import Phaser since it's a client-side library
      const Phaser = await import('phaser');
      
      const config = {
        type: Phaser.AUTO,
        width: 600,
        height: 400,
        parent: 'nbl-game-container',
        backgroundColor: '#0a1a2a',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 50 }, // Simulated buoyancy
            debug: false
          }
        },
        scene: {
          preload: preload,
          create: create,
          update: update
        }
      };

      function preload() {
        // Create simple shapes as sprites using data URIs
        // Use proper encoding for Unicode characters
        const astronautSvg = `
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" fill="#ffffff" stroke="#0066cc" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" fill="#0066cc" font-size="16">&#128104;&#8205;&#128640;</text>
          </svg>
        `;
        this.load.image('astronaut', 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(astronautSvg))));
        
        const taskSvg = `
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" fill="#ffaa00" stroke="#ff6600" stroke-width="2" rx="4"/>
            <text x="12" y="16" text-anchor="middle" fill="#ffffff" font-size="12">&#9881;&#65039;</text>
          </svg>
        `;
        this.load.image('task', 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(taskSvg))));
      }

      function create() {
        // Add water effect background
        this.add.rectangle(300, 200, 600, 400, 0x004466, 0.3);
        
        // Create astronaut sprite
        this.astronaut = this.physics.add.sprite(100, 200, 'astronaut');
        this.astronaut.setCollideWorldBounds(true);
        this.astronaut.setBounce(0.3);
        this.astronaut.setDrag(100);
        
        // Create tasks
        this.tasks = this.physics.add.group();
        
        // Create 5 random tasks
        for (let i = 0; i < 5; i++) {
          const x = Phaser.Math.Between(150, 550);
          const y = Phaser.Math.Between(100, 350);
          const task = this.tasks.create(x, y, 'task');
          task.setScale(1.2);
          task.body.setImmovable(true);
        }
        
        // Collision detection
        this.physics.add.overlap(this.astronaut, this.tasks, this.collectTask, null, this);
        
        // UI Elements
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
          fontSize: '18px',
          fill: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 8, y: 4 }
        });
        
        this.instructionText = this.add.text(300, 50, 'Use ARROW KEYS to move. Collect all tools! 🔧', {
          fontSize: '14px',
          fill: '#ffff00',
          backgroundColor: '#000000',
          padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
        
        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        // Game state
        this.score = 0;
        this.completedTasks = 0;
        this.gameActive = true;
      }

      function collectTask(astronaut, task) {
        task.destroy();
        this.score += 100;
        this.completedTasks++;
        
        // Update UI
        this.scoreText.setText('Score: ' + this.score);
        
        // Check win condition
        if (this.completedTasks >= 5) {
          this.gameActive = false;
          this.add.text(300, 200, '🎉 MISSION COMPLETE! 🎉', {
            fontSize: '24px',
            fill: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 16, y: 8 }
          }).setOrigin(0.5);
        }
      }

      function update() {
        if (!this.gameActive || !this.astronaut) return;
        
        // Movement controls with buoyancy simulation
        const speed = 150;
        
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
          this.astronaut.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
          this.astronaut.setVelocityX(speed);
        } else {
          this.astronaut.setVelocityX(0);
        }
        
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
          this.astronaut.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
          this.astronaut.setVelocityY(speed);
        }
        
        // Simulate underwater resistance
        this.astronaut.body.velocity.x *= 0.95;
        this.astronaut.body.velocity.y *= 0.95;
      }

      // Store the game instance to prevent reinitialization
      gameInstanceRef.current = new Phaser.Game(config);
    };

    initGame();
    
    // Cleanup function to destroy the game when component unmounts
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array to ensure initialization only happens once

  return (
    <div id="nbl-game-container" style={{ width: '600px', height: '400px', margin: '0 auto' }}></div>
  );
}