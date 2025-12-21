import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Text, Image, Environment, Stars, Sparkles, MeshReflectorMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';


// --- AUDIO MANAGER ---
const AudioManager = ({ scene, isLocked }) => {
  const audioRef = useRef(null);
  useEffect(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (!isLocked) return;
    const fileMap = { lobby: '/sounds/lobby.mp3', scifi: '/sounds/scifi.mp3', horror: '/sounds/horror.mp3', action: '/sounds/action.mp3' };
    const filePath = fileMap[scene];
    if (!filePath) return;
    const audio = new Audio(filePath);
    audio.loop = true; audio.volume = 0.4;
    audio.play().catch(err => console.warn("Audio waiting for user interaction..."));
    audioRef.current = audio;
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [scene, isLocked]);
  return null;
};

// --- FIXED PLAYER CONTROLLER (Flashlight) ---
const PlayerController = ({ isLocked, onPortalEnter, currentScene, setUiFlashlight }) => {
  const { camera, scene } = useThree();
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });
  const [flashlightOn, setFlashlightOn] = useState(false);

  // Refs
  const spotLightRef = useRef();
  const targetRef = useRef();

  useEffect(() => {
    // 1. Initial Position
    camera.position.set(0, 1.7, 12);

    // 2. Create Target for Light
    const target = new THREE.Object3D();
    scene.add(target);
    targetRef.current = target;

    // 3. Controls
    const handleKeyDown = (e) => {
      switch(e.code) {
        case 'KeyW': setMovement(m => ({...m, forward:true})); break;
        case 'KeyS': setMovement(m => ({...m, backward:true})); break;
        case 'KeyA': setMovement(m => ({...m, left:true})); break;
        case 'KeyD': setMovement(m => ({...m, right:true})); break;
        // FLASHLIGHT TOGGLE
        case 'KeyF':
            setFlashlightOn(prev => {
                const newState = !prev;
                if(setUiFlashlight) setUiFlashlight(newState); // Update UI
                return newState;
            });
            break;
      }
    };
    const handleKeyUp = (e) => {
      switch(e.code) {
        case 'KeyW': setMovement(m => ({...m, forward:false})); break;
        case 'KeyS': setMovement(m => ({...m, backward:false})); break;
        case 'KeyA': setMovement(m => ({...m, left:false})); break;
        case 'KeyD': setMovement(m => ({...m, right:false})); break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        if(targetRef.current) scene.remove(targetRef.current);
    };
  }, [camera, scene, currentScene]);

  useFrame((state, delta) => {
    if (!isLocked) return;

    // Movement
    const speed = 10 * delta;
    if (movement.forward) camera.translateZ(-speed);
    if (movement.backward) camera.translateZ(speed);
    if (movement.left) camera.translateX(-speed);
    if (movement.right) camera.translateX(speed);
    camera.position.y = 1.7;

    // Update Flashlight Position
    if (spotLightRef.current && targetRef.current) {
        spotLightRef.current.position.copy(camera.position);

        // Offset light slightly to the right (like holding it in hand)
        const rightOffset = new THREE.Vector3(0.3, -0.2, 0).applyQuaternion(camera.quaternion);
        spotLightRef.current.position.add(rightOffset);

        // Project target in front of camera
        const front = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        targetRef.current.position.copy(camera.position).add(front);
        spotLightRef.current.target = targetRef.current;
    }

    // Portal Logic
    if (onPortalEnter) {
        if (currentScene === 'lobby') {
            if (camera.position.x < -6 && camera.position.z < -6) onPortalEnter('scifi');
            if (camera.position.x > 6 && camera.position.z < -6) onPortalEnter('horror');
            if (Math.abs(camera.position.x) < 3 && camera.position.z < -10) onPortalEnter('action');
        } else {
            if (camera.position.z > 15) onPortalEnter('lobby');
        }
    }
  });

  return (
    <>
        {/* WE RENDER IT ALWAYS, BUT TOGGLE VISIBILITY */}
        <spotLight
            ref={spotLightRef}
            visible={flashlightOn}
            intensity={50}  /* Increased Intensity */
            distance={40}
            angle={0.6}
            penumbra={0.2}
            color="#ffffff"
            castShadow
        />
    </>
  );
};

// --- POSTER COMPONENT ---
const Poster3D = ({ url, position, rotation=[0,0,0], movieId, title }) => {
  const [hovered, setHover] = useState(false);
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
        const t = state.clock.elapsedTime;
        const targetScale = hovered ? 1.15 : 1;
        ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        ref.current.position.y = position[1] + Math.sin(t * 2) * 0.05;
    }
  });
  return (
    <group ref={ref} position={position} rotation={rotation}
      onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}
      onClick={() => window.location.href = `/movie/${movieId}`}
    >
      <mesh position={[0,0,-0.1]}><boxGeometry args={[2.4, 3.4, 0.1]} /><meshStandardMaterial color="#111" /></mesh>
      <Image url={url} scale={[2.2, 3.2]} transparent />
      {hovered && <Text position={[0, -2, 0]} fontSize={0.3} color="white" anchorX="center" backgroundColor="black">{title}</Text>}
    </group>
  );
};

// --- GENRE SHELF ---
const GenreShelf = ({ genreId, position }) => {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`)
            .then(res => res.json())
            .then(data => setMovies(data.results.slice(0, 6)));
    }, [genreId]);
    return <group position={position}>{movies.map((m, i) => { const x = (i - 2.5) * 4; const url = `https://image.tmdb.org/t/p/w500${m.poster_path}?v=1`; return <Poster3D key={m.id} url={url} position={[x, 0, 0]} movieId={m.id} title={m.title} /> })}</group>;
}

// --- EXIT PORTAL (GREY) ---
const ExitPortal = () => {
    const greyColor = "#888888";
    const lightGreyColor = "#cccccc";
    return (
        <group position={[0, 0, 16]}>
             <group rotation={[0, Math.PI, 0]}>
                 <Text position={[0, 4.5, 0]} fontSize={0.7} color={lightGreyColor} anchorX="center" outlineWidth={0.05} outlineColor="#333333">RETURN TO LOBBY</Text>
                 <Text position={[0, 3.8, 0]} fontSize={0.3} color="#aaa" anchorX="center">(Walk into energy field)</Text>
             </group>
             <mesh position={[0, 1.5, 0]}><boxGeometry args={[4.2, 5.2, 0.2]} /><meshStandardMaterial color={greyColor} emissive={greyColor} emissiveIntensity={2} toneMapped={false} /></mesh>
             <mesh position={[0, 1.5, 0.01]}><planeGeometry args={[3.8, 4.8]} /><meshBasicMaterial color="black" /></mesh>
             <Sparkles count={80} scale={[3.5, 4.5, 0.5]} size={5} speed={1.5} color={lightGreyColor} position={[0, 1.5, 0.2]} />
             <pointLight position={[0, 2, -1]} color={greyColor} intensity={3} distance={15} />
        </group>
    );
};

// --- PROPS ---
const StreetLamp = ({ position }) => (
    <group position={position}>
        <mesh position={[0, 3, 0]}><cylinderGeometry args={[0.1, 0.1, 6]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh position={[0, 6, 0.5]} rotation={[0.5, 0, 0]}><boxGeometry args={[0.4, 0.2, 1]} /><meshStandardMaterial color="#444" /></mesh>
        <spotLight position={[0, 5.8, 0.8]} angle={0.6} penumbra={0.5} intensity={20} distance={15} color="#ffccaa" castShadow />
        <mesh position={[0, 5.8, 0.8]}><sphereGeometry args={[0.2]} /><meshBasicMaterial color="#ffccaa" /></mesh>
    </group>
);
const Graveyard = () => {
    const tombs = useMemo(() => new Array(20).fill(0).map(() => ({ x: (Math.random() - 0.5) * 30, z: (Math.random() - 0.5) * 20 - 5, rot: (Math.random() - 0.5) * 0.5, scale: 0.8 + Math.random() * 0.5 })), []);
    return <group>{tombs.map((t, i) => <mesh key={i} position={[t.x, t.scale/2, t.z]} rotation={[0, t.rot, 0]}><boxGeometry args={[0.6 * t.scale, 1.2 * t.scale, 0.2]} /><meshStandardMaterial color="#2a2a2a" roughness={1} /></mesh>)}</group>;
};
const GiantRings = () => {
    const ref = useRef();
    useFrame(({ clock }) => { if (ref.current) { ref.current.rotation.x = clock.elapsedTime * 0.1; ref.current.rotation.y = clock.elapsedTime * 0.05; } });
    return <group ref={ref} position={[0, 10, -20]}><mesh rotation={[1, 0, 0]}><torusGeometry args={[15, 0.2, 16, 100]} /><meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} /></mesh><mesh rotation={[0, 1, 0]}><torusGeometry args={[12, 0.2, 16, 100]} /><meshStandardMaterial color="#0088ff" emissive="#0088ff" emissiveIntensity={2} toneMapped={false} /></mesh></group>;
};
const CityBackground = () => {
    const buildings = useMemo(() => new Array(40).fill(0).map(() => ({ position: [(Math.random() - 0.5) * 100, 0, -20 - Math.random() * 40], scale: [2 + Math.random() * 4, 10 + Math.random() * 30, 2 + Math.random() * 4] })), []);
    return <group>{buildings.map((b, i) => <mesh key={i} position={[b.position[0], b.scale[1]/2, b.position[2]]}><boxGeometry args={b.scale} /><meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} /></mesh>)}</group>;
};
const MovingSpotlight = ({ position, color }) => {
    const light = useRef();
    const target = useRef();
    useFrame(({ clock }) => { const t = clock.elapsedTime; target.current.position.x = position[0] + Math.sin(t) * 10; target.current.position.z = position[2] + Math.cos(t * 0.5) * 10; light.current.target = target.current; });
    return <><spotLight ref={light} position={position} color={color} intensity={5} angle={0.5} penumbra={0.5} castShadow /><mesh ref={target} position={[position[0], 0, position[2]]} visible={false}><boxGeometry /></mesh></>;
};
const FloatingDebris = () => {
    const debris = useMemo(() => new Array(30).fill(0).map(() => ({ position: [(Math.random() - 0.5) * 40, Math.random() * 20, (Math.random() - 0.5) * 40], scale: Math.random() * 0.5 + 0.2 })), []);
    return <group>{debris.map((d, i) => <Float key={i} speed={1} rotationIntensity={2} floatIntensity={2}><mesh position={d.position}><dodecahedronGeometry args={[d.scale, 0]} /><meshStandardMaterial color="#444" wireframe /></mesh></Float>)}</group>;
};

// ================= SCENES =================
const LobbyScene = ({ onPortalEnter, isLocked, setUiFlashlight }) => (
    <>
      <ambientLight intensity={0.5} /> <pointLight position={[0, 10, 0]} intensity={1} /> <Environment preset="city" /> <Sparkles count={50} scale={20} size={5} speed={0.4} opacity={0.5} color="gold" />
      <PlayerController isLocked={isLocked} onPortalEnter={onPortalEnter} currentScene="lobby" setUiFlashlight={setUiFlashlight} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[50, 50]} /><MeshReflectorMaterial blur={[300, 100]} resolution={1024} mixBlur={1} mixStrength={40} roughness={1} depthScale={1.2} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#151515" metalness={0.5} /></mesh>
      <Text position={[0, 8, -5]} fontSize={1} color="gold" anchorX="center">CHOOSE YOUR REALM</Text> <Text position={[0, 7, -5]} fontSize={0.5} color="#aaa" anchorX="center">(Walk into a door)</Text>
      <group position={[-10, 0, -10]}><Text position={[0, 6, 0]} fontSize={1} color="#00ffff" anchorX="center">SCI-FI</Text><mesh position={[0, 2, 0]}><boxGeometry args={[4, 6, 0.5]} /><meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} /></mesh></group>
      <group position={[0, 0, -15]}><Text position={[0, 6, 0]} fontSize={1} color="#ffaa00" anchorX="center">ACTION</Text><mesh position={[0, 2, 0]}><boxGeometry args={[4, 6, 0.5]} /><meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.5} /></mesh></group>
      <group position={[10, 0, -10]}><Text position={[0, 6, 0]} fontSize={1} color="#ff0000" anchorX="center">HORROR</Text><mesh position={[0, 2, 0]}><boxGeometry args={[4, 6, 0.5]} /><meshStandardMaterial color="#990000" emissive="#ff0000" emissiveIntensity={0.2} /></mesh></group>
    </>
);

const SciFiScene = ({ isLocked, onPortalEnter, setUiFlashlight }) => (
    <>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> <ambientLight intensity={0.2} /> <pointLight position={[0, 10, 0]} color="#00ffff" intensity={2} />
        <PlayerController isLocked={isLocked} onPortalEnter={onPortalEnter} currentScene="scifi" setUiFlashlight={setUiFlashlight} /> <ExitPortal /> <FloatingDebris /> <GiantRings />
        <Text position={[0, 8.5, -10]} fontSize={2} color="#00ffff" anchorX="center">SCI-FI REALM</Text>
        <mesh position={[0, -1, 0]} rotation={[-Math.PI/2, 0, 0]}><planeGeometry args={[100, 100, 20, 20]} /><meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.1} /></mesh>
        <GenreShelf genreId={878} position={[0, 4.5, -8]} />
    </>
);

const HorrorScene = ({ isLocked, onPortalEnter, setUiFlashlight }) => (
    <>
        <color attach="background" args={['#050000']} /> <fog attach="fog" args={['#050000', 2, 20]} /> <ambientLight intensity={0.1} /> <pointLight position={[0, 5, 0]} color="#ff0000" intensity={1.5} distance={15} /> <Sparkles count={200} scale={[20, 20, 20]} size={6} speed={0.2} opacity={0.8} color="#ff3333" />
        <PlayerController isLocked={isLocked} onPortalEnter={onPortalEnter} currentScene="horror" setUiFlashlight={setUiFlashlight} /> <ExitPortal /> <Graveyard />
        <Text position={[0, 8.5, -8]} fontSize={2} color="#cc0000" anchorX="center">HORROR</Text>
        <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[100, 100]} /><meshStandardMaterial color="#1a0505" roughness={1} /></mesh>
        <GenreShelf genreId={27} position={[0, 4.5, -6]} />
    </>
);

const ActionScene = ({ isLocked, onPortalEnter, setUiFlashlight }) => (
    <>
        <Environment preset="sunset" /> <ambientLight intensity={0.1} />
        <PlayerController isLocked={isLocked} onPortalEnter={onPortalEnter} currentScene="action" setUiFlashlight={setUiFlashlight} /> <ExitPortal /> <CityBackground /> <Sparkles count={150} scale={[30, 20, 30]} size={10} speed={2} opacity={0.8} color="orange" position={[0, 5, -10]} />
        <StreetLamp position={[-8, 0, -5]} /> <StreetLamp position={[8, 0, -5]} /> <StreetLamp position={[-8, 0, 5]} /> <StreetLamp position={[8, 0, 5]} />
        <MovingSpotlight position={[-15, 15, -10]} color="white" /> <MovingSpotlight position={[15, 15, -10]} color="white" />
        <Text position={[0, 8.5, -10]} fontSize={2} color="orange" anchorX="center">ACTION ZONE</Text>
        <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[100, 100]} /><meshStandardMaterial color="#222" roughness={0.8} /></mesh>
        <GenreShelf genreId={28} position={[0, 4.5, -8]} />
    </>
);

// ================= MAIN COMPONENT =================
const FavoritesWorld = () => {
  const [currentScene, setCurrentScene] = useState('lobby');
  const [isLocked, setIsLocked] = useState(false);
  const [uiFlashlight, setUiFlashlight] = useState(false); // To update UI text
  const containerRef = useRef();

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = 'auto'; }; }, []);
  const handleLock = () => { setIsLocked(true); if (containerRef.current && !document.fullscreenElement) { containerRef.current.requestFullscreen().catch(err => console.warn(err)); } };

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', background: 'black', position:'relative' }}>
      <AudioManager scene={currentScene} isLocked={isLocked} />
      <div className="ui-layer" style={{ pointerEvents: 'none' }}>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ pointerEvents: 'auto' }}>
                {currentScene === 'lobby' ? (
                    <Link to="/browse" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', background:'rgba(0,0,0,0.5)', padding:'5px 10px', borderRadius:'5px' }}>⬅ Back to 2D</Link>
                ) : (
                    <button onClick={() => setCurrentScene('lobby')} style={{ background:'rgba(0,0,0,0.5)', border:'1px solid white', color:'white', padding:'8px 15px', borderRadius:'5px', cursor:'pointer', fontSize:'16px' }}>⬅ Back to Lobby</button>
                )}
            </div>
            {/* FLASHLIGHT INDICATOR */}
            <div style={{ color: uiFlashlight ? '#ffff00' : '#555', fontSize: '20px', fontWeight: 'bold', textShadow: '0 0 5px black' }}>
                {uiFlashlight ? "🔦 ON" : "🔦 OFF"}
            </div>
        </div>
        <div style={{ position:'absolute', bottom:'20px', width:'100%', textAlign:'center', pointerEvents:'none' }}>
             <div className={`hud-text ${isLocked ? 'locked' : 'unlocked'}`} style={{ fontSize:'18px', textShadow:'0 2px 4px black' }}>
                {isLocked ? "WASD to Move • 'F' for Flashlight" : "CLICK SCREEN TO START"}
            </div>
        </div>
      </div>

      <Canvas shadows camera={{ fov: 60 }}>
        <PointerLockControls onLock={handleLock} onUnlock={() => setIsLocked(false)} />
        {currentScene === 'lobby' && <LobbyScene isLocked={isLocked} onPortalEnter={setCurrentScene} setUiFlashlight={setUiFlashlight} />}
        {currentScene === 'scifi' && <SciFiScene isLocked={isLocked} onPortalEnter={setCurrentScene} setUiFlashlight={setUiFlashlight} />}
        {currentScene === 'horror' && <HorrorScene isLocked={isLocked} onPortalEnter={setCurrentScene} setUiFlashlight={setUiFlashlight} />}
        {currentScene === 'action' && <ActionScene isLocked={isLocked} onPortalEnter={setCurrentScene} setUiFlashlight={setUiFlashlight} />}
      </Canvas>
    </div>
  );
};

export default FavoritesWorld;