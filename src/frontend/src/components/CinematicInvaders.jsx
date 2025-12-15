import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- GAME CONSTANTS ---
const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const PLAYER_SIZE = 30;
const PLAYER_SPEED = 8;
const INVADER_ROWS = 3;
const INVADER_COLS = 5;
const INVADER_SIZE = 25;
const BULLET_SIZE = 5;
const BULLET_SPEED = 10;
const INITIAL_INVADER_DROP_FRAMES = 50; // Invaders move every 50 frames
const INVADER_MOVE_DISTANCE = 5;

// --- Helper Functions ---
const initializeInvaders = (rows, cols) => {
    let invaders = [];
    let id = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            invaders.push({
                id: id++,
                x: (GAME_WIDTH / cols) * col + 15,
                y: row * 30 + 10,
            });
        }
    }
    return invaders;
};

const CinematicInvaders = ({ onGameOver }) => {
    // State (used for rendering only)
    const [score, setScore] = useState(0);
    const [renderToggle, setRenderToggle] = useState(false);
    const [wave, setWave] = useState(1); // NEW STATE: Track the wave number

    // Refs (used for mutable positions inside gameLoop)
    const playerPosRef = useRef(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
    const bulletsRef = useRef([]);
    const invadersRef = useRef(initializeInvaders(INVADER_ROWS, INVADER_COLS));
    const scoreRef = useRef(0);
    const frameCountRef = useRef(0);
    const gameLoopIdRef = useRef(null);
    const dropFramesRef = useRef(INITIAL_INVADER_DROP_FRAMES); // Ref for dynamic speed


    // --- FUNCTION TO START A NEW WAVE ---
    const startNewWave = useCallback((currentWave) => {
        const nextWave = currentWave + 1;
        setWave(nextWave);

        // Increase difficulty: Make them drop faster (lower frame count)
        // Ensure dropFrames doesn't go below a certain threshold (e.g., 10 frames)
        dropFramesRef.current = Math.max(10, dropFramesRef.current - 5);

        // Reset and generate a new set of invaders
        invadersRef.current = initializeInvaders(
            INVADER_ROWS + Math.min(nextWave, 3), // Max 3 extra rows
            INVADER_COLS
        );
    }, []);


    // --- GAME LOOP ---
    const gameLoop = useCallback(() => {
        frameCountRef.current++;

        // 0. CHECK FOR WAVE CLEAR (CRITICAL NEW LOGIC)
        if (invadersRef.current.length === 0) {
            startNewWave(wave);
            setRenderToggle(t => !t); // Force render to show new invaders
            gameLoopIdRef.current = requestAnimationFrame(gameLoop);
            return;
        }

        // 1. Move Bullets (Logic remains the same)
        bulletsRef.current = bulletsRef.current
            .map(b => ({ ...b, y: b.y - BULLET_SPEED }))
            .filter(b => b.y > 0);

        // 2. Collision Detection (Logic remains the same)
        let invadersToKeep = [];
        let scoreIncrease = 0;

        invadersRef.current.forEach(invader => {
            let isHit = false;

            bulletsRef.current = bulletsRef.current.filter(bullet => {
                if (bullet.x >= invader.x &&
                    bullet.x <= invader.x + INVADER_SIZE &&
                    bullet.y >= invader.y &&
                    bullet.y <= invader.y + INVADER_SIZE) {

                    isHit = true;
                    scoreIncrease += 10;
                    return false;
                }
                return true;
            });

            if (!isHit) {
                invadersToKeep.push(invader);
            }
        });

        invadersRef.current = invadersToKeep;

        if (scoreIncrease > 0) {
            scoreRef.current += scoreIncrease;
            setScore(scoreRef.current);
        }


        // 3. Move Invaders Down Periodically
        if (frameCountRef.current % dropFramesRef.current === 0) {
            invadersRef.current = invadersRef.current.map(i => ({
                ...i,
                y: i.y + INVADER_MOVE_DISTANCE
            }));

            // Check for Game Over
            if (invadersRef.current.some(i => i.y + INVADER_SIZE >= GAME_HEIGHT - PLAYER_SIZE)) {
                 onGameOver(scoreRef.current);
                 cancelAnimationFrame(gameLoopIdRef.current);
                 return;
            }
        }

        // 4. Force a Re-render
        setRenderToggle(t => !t);

        // 5. Continue Loop
        gameLoopIdRef.current = requestAnimationFrame(gameLoop);
    }, [onGameOver, wave, startNewWave]); // Added 'wave' and 'startNewWave'

    // --- INITIALIZATION & Cleanup ---
    useEffect(() => {
        gameLoopIdRef.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(gameLoopIdRef.current);
    }, [gameLoop]);


    // --- INPUT HANDLING ---
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            playerPosRef.current = Math.max(0, playerPosRef.current - PLAYER_SPEED);
        } else if (e.key === 'ArrowRight') {
            playerPosRef.current = Math.min(GAME_WIDTH - PLAYER_SIZE, playerPosRef.current + PLAYER_SPEED);
        } else if (e.key === ' ' || e.key === 'ArrowUp') {
            e.preventDefault();
            // Only allow shooting if there is popcorn left
            if (invadersRef.current.length > 0) {
                bulletsRef.current = [
                    ...bulletsRef.current,
                    {
                        id: Date.now(),
                        x: playerPosRef.current + PLAYER_SIZE / 2 - BULLET_SIZE / 2,
                        y: GAME_HEIGHT - PLAYER_SIZE
                    }
                ];
            }
        }
        setRenderToggle(t => !t);
    };

    // Attach/Detach keyboard listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // --- RENDER ---
    return (
        <div
            tabIndex={0}
            style={{
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                backgroundColor: '#0f172a',
                border: '3px solid #40bcf4',
                position: 'relative',
                margin: '20px auto',
                overflow: 'hidden',
                outline: 'none',
            }}
        >
            {/* SCORE DISPLAY */}
            <div style={{
                position: 'absolute', top: 10, left: 10, color: 'white', fontWeight: 'bold'
            }}>
                SCORE: {score} | WAVE: {wave}
            </div>

            {/* PLAYER (Camera Icon) */}
            <div
                style={{
                    position: 'absolute',
                    width: PLAYER_SIZE,
                    height: PLAYER_SIZE,
                    left: playerPosRef.current,
                    bottom: 0,
                    fontSize: '24px',
                    textAlign: 'center',
                    lineHeight: '30px',
                    cursor: 'default'
                }}
            >
                📸
            </div>

            {/* INVADERS (Popcorn Bags) */}
            {invadersRef.current.map(invader => (
                <div
                    key={invader.id}
                    style={{
                        position: 'absolute',
                        width: INVADER_SIZE,
                        height: INVADER_SIZE,
                        left: invader.x,
                        top: invader.y,
                        fontSize: '20px',
                        textAlign: 'center',
                    }}
                >
                    🍿
                </div>
            ))}

            {/* BULLETS (Star Ratings) */}
            {bulletsRef.current.map(bullet => (
                <div
                    key={bullet.id}
                    style={{
                        position: 'absolute',
                        width: BULLET_SIZE,
                        height: BULLET_SIZE,
                        left: bullet.x,
                        top: bullet.y,
                        backgroundColor: '#ffc107',
                        borderRadius: '50%',
                    }}
                />
            ))}
        </div>
    );
};

export default CinematicInvaders;