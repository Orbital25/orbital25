class NBLGame {
    constructor() {
        this.game = null;
        this.scene = null;
        this.astronaut = null;
        this.score = 0;
        this.timeLeft = 120;
        this.gameActive = false;
        this.tasks = [];
        this.completedTasks = 0;
    }

    async init() {
        try {
            const config = {
                type: Phaser.AUTO,
                width: 600,
                height: 400,
                parent: 'game-container',
                backgroundColor: '#0a1a2a',
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 50 }, // Simulated buoyancy
                        debug: false
                    }
                },
                scene: {
                    preload: this.preload.bind(this),
                    create: this.create.bind(this),
                    update: this.update.bind(this)
                }
            };
            
            this.game = new Phaser.Game(config);
            console.log('✅ NBL Game initialized');
        } catch (error) {
            console.error('❌ Failed to initialize NBL game:', error);
            throw error;
        }
    }

    preload() {
        // Create simple shapes as sprites
        this.load.image('astronaut', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="15" fill="#ffffff" stroke="#0066cc" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" fill="#0066cc" font-size="16">👨‍🚀</text>
            </svg>
        `));
        
        this.load.image('task', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="#ffaa00" stroke="#ff6600" stroke-width="2" rx="4"/>
                <text x="12" y="16" text-anchor="middle" fill="#ffffff" font-size="12">⚙️</text>
            </svg>
        `));
    }

    create() {
        this.scene = this;
        
        // Add water effect background
        this.add.rectangle(300, 200, 600, 400, 0x004466, 0.3);
        
        // Create astronaut sprite
        this.astronaut = this.physics.add.sprite(100, 200, 'astronaut');
        this.astronaut.setCollideWorldBounds(true);
        this.astronaut.setBounce(0.3);
        this.astronaut.setDrag(100);
        
        // Create tasks
        this.createTasks();
        
        // UI Elements
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        });
        
        this.timeText = this.add.text(16, 50, 'Time: 120s', {
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
        
        // Start game
        this.startGame();
    }

    createTasks() {
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
    }

    collectTask(astronaut, task) {
        task.destroy();
        this.score += 100;
        this.completedTasks++;
        
        // Update UI
        this.scoreText.setText('Score: ' + this.score);
        
        // Check win condition
        if (this.completedTasks >= 5) {
            this.winGame();
        }
    }

    startGame() {
        this.gameActive = true;
        this.timeLeft = 120;
        
        // Start countdown timer
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        this.timeLeft--;
        this.timeText.setText('Time: ' + this.timeLeft + 's');
        
        if (this.timeLeft <= 0) {
            this.gameOver();
        }
    }

    update() {
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

    winGame() {
        this.gameActive = false;
        this.gameTimer.destroy();
        
        const bonusScore = this.timeLeft * 10;
        this.score += bonusScore;
        
        this.add.text(300, 200, '🎉 MISSION COMPLETE! 🎉', {
            fontSize: '24px',
            fill: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 16, y: 8 }
        }).setOrigin(0.5);
        
        this.add.text(300, 240, `Final Score: ${this.score}`, {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
        
        // Submit score
        this.submitScore();
    }

    gameOver() {
        this.gameActive = false;
        this.gameTimer.destroy();
        
        this.add.text(300, 200, '⏰ TIME UP!', {
            fontSize: '24px',
            fill: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 16, y: 8 }
        }).setOrigin(0.5);
        
        this.add.text(300, 240, `Tasks Completed: ${this.completedTasks}/5`, {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
        
        this.submitScore();
    }

    async submitScore() {
        try {
            const scoreData = {
                player_id: 'player_' + Date.now(),
                score: this.score.toString(),
                time_elapsed: (120 - this.timeLeft).toString(),
                completed: this.completedTasks >= 5
            };
            
            const response = await fetch('/api/nbl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scoreData)
            });
            
            const result = await response.json();
            console.log('Score submitted:', result);
        } catch (error) {
            console.error('Failed to submit score:', error);
        }
    }

    destroy() {
        if (this.game) {
            this.game.destroy(true);
        }
    }
}

// Global functions for backward compatibility
let nblGameInstance = null;

async function initNBLGame() {
    nblGameInstance = new NBLGame();
    await nblGameInstance.init();
    window.nblGame = nblGameInstance;
}