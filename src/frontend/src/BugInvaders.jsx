import React, { useState, useEffect, useRef } from 'react';

const BugInvaders = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // To test while online, change the line above to: useState(false);

  const stageRef = useRef(null);
  const requestRef = useRef();

  // Game Configuration
  const TARGET_WORD = "CINEEFXOULIDES";

  const gameState = useRef({
    playerX: 20,
    bullets: [],
    enemies: [], // Now contains {x, y, char}
    score: 0,
    gameOver: false,
    frameCount: 0,
    cols: 40,
    rows: 20,
    keys: {}
  });

  // 1. Network Listener
  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // 2. Game Loop
  useEffect(() => {
    if (isOnline) return;

    const state = gameState.current;

    // Reset State
    state.gameOver = false;
    state.score = 0;
    state.bullets = [];
    state.enemies = [];
    state.playerX = Math.floor(state.cols / 2);

    // --- HELPER: Spawn the word "CINEEFXOULIDES" ---
    const spawnWave = () => {
      const wordLength = TARGET_WORD.length;
      // Calculate start position to center the word
      // We multiply by 2 because we will space letters out by 1 empty cell (C I N E...)
      // to make it look more like Space Invaders
      const totalWidth = wordLength * 2;
      const startX = Math.floor((state.cols - totalWidth) / 2);

      // Create 3 rows of the word
      for (let r = 0; r < 3; r++) {
        for (let i = 0; i < wordLength; i++) {
          state.enemies.push({
            x: startX + (i * 2), // *2 spaces them out slightly
            y: r,
            char: TARGET_WORD[i] // <--- Each enemy is a specific letter
          });
        }
      }
    };

    // Initial Spawn
    spawnWave();

    // Input Handling
    const handleKeyDown = (e) => {
        state.keys[e.key] = true;
        if (e.key === ' ' && !state.gameOver) {
            state.bullets.push({ x: state.playerX, y: state.rows - 2 });
        }
        if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
            e.preventDefault();
        }
    };
    const handleKeyUp = (e) => state.keys[e.key] = false;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // --- THE LOOP ---
    const loop = () => {
      if (isOnline) return;

      if (!state.gameOver) {
        state.frameCount++;

        // 1. Move Player
        if (state.keys['ArrowLeft'] && state.playerX > 0) state.playerX--;
        if (state.keys['ArrowRight'] && state.playerX < state.cols - 1) state.playerX++;

        // 2. Move Bullets (Up)
        state.bullets.forEach(b => b.y--);
        state.bullets = state.bullets.filter(b => b.y >= 0);

        // 3. Move Enemies (Down) - Slower (every 40 frames)
        if (state.frameCount % 40 === 0) {
            state.enemies.forEach(e => e.y++);
        }

        // 4. Collisions
        state.enemies.forEach((enemy, eIdx) => {
             // Bullet hits Letter
             state.bullets.forEach((bullet, bIdx) => {
                 if (bullet.x === enemy.x && bullet.y === enemy.y) {
                     state.bullets.splice(bIdx, 1);
                     state.enemies.splice(eIdx, 1); // Remove the specific letter
                     state.score += 10;
                 }
             });
             // Letter hits Bottom
             if (enemy.y >= state.rows - 1) state.gameOver = true;
        });

        // 5. Respawn if word destroyed
        if (state.enemies.length === 0) {
            spawnWave(); // Spawn "CINEEFXOULIDES" again
        }
      }

      // --- DRAWING ---
      if (stageRef.current) {
        let grid = Array(state.rows).fill(0).map(() => Array(state.cols).fill(' '));

        if (state.gameOver) {
            const msg = "GAME OVER";
            const startCol = Math.floor((state.cols - msg.length)/2);
            for(let i=0; i<msg.length; i++) grid[state.rows/2][startCol + i] = msg[i];
        } else {
            // Draw Player
            grid[state.rows - 1][state.playerX] = '^';

            // Draw Bullets
            state.bullets.forEach(b => grid[b.y][b.x] = '|');

            // Draw Enemies (The Letters)
            state.enemies.forEach(e => {
                // Ensure we don't draw outside grid if resized
                if(e.y < state.rows && e.x < state.cols) {
                    grid[e.y][e.x] = e.char; // <--- Draw 'C', 'I', 'N', etc.
                }
            });
        }

        // Render
        stageRef.current.innerText =
            `SCORE: ${state.score}\n` +
            grid.map(row => row.join('')).join('\n');
      }

      setTimeout(() => {
          requestRef.current = requestAnimationFrame(loop);
      }, 1000 / 30);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isOnline]);

  if (isOnline) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#000', zIndex: 9999, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#33ff33', fontFamily: '"Courier New", monospace', fontWeight: 'bold'
    }}>
      <h2 style={{margin: 0, textShadow: '0 0 5px #33ff33'}}>&gt; CONNECTION LOST</h2>
      <p style={{marginBottom: 20}}>&gt; Defend against CINEEFXOULIDES</p>
      <pre
        ref={stageRef}
        style={{
            border: '2px solid #33ff33',
            padding: '10px',
            backgroundColor: '#111',
            lineHeight: '1em',
            fontSize: '16px'
        }}
      >
        Loading...
      </pre>
    </div>
  );
};

export default BugInvaders;