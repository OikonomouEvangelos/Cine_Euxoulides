// src/components/MovieWheel.jsx
import React, { useMemo, useState } from "react";
import MovieCard from "./MovieCard";
import "./MovieWheel.css";

// Fisher–Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MovieWheel = ({ genreId, title = "Δεν ξέρεις τι να δεις;" }) => {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const [candidates, setCandidates] = useState([]); // 10 ταινίες
  const [winner, setWinner] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(null);


  const sliceAngle = useMemo(() => {
    return candidates.length ? 360 / candidates.length : 0;
  }, [candidates.length]);

const posterUrl = (m, size = "w1280") =>
  m?.poster_path ? `https://image.tmdb.org/t/p/${size}${m.poster_path}` : null;

const ratingText = (m) =>
  typeof m?.vote_average === "number" ? m.vote_average.toFixed(1) : "—";


  const loadCandidates = async () => {
    if (!API_KEY || !genreId) return;

    setLoading(true);
    setWinner(null);

    try {
      const firstUrl =
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}` +
        `&language=el-GR&with_genres=${genreId}&sort_by=popularity.desc&page=1&include_adult=false`;

      const firstRes = await fetch(firstUrl);
      const firstData = await firstRes.json();

      const totalPages = Math.min(firstData?.total_pages || 1, 50);
      const randomPage = Math.floor(Math.random() * totalPages) + 1;

      const url =
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}` +
        `&language=el-GR&with_genres=${genreId}&sort_by=popularity.desc&page=${randomPage}&include_adult=false`;

      const res = await fetch(url);
      const data = await res.json();

      const withPoster = (data.results || []).filter((m) => m.poster_path);
      const ten = shuffle(withPoster).slice(0, 10);

      setCandidates(ten);
      setRotation(0);
    } catch (e) {
      console.error("Wheel load error:", e);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const openWheel = async () => {
    setIsOpen(true);
    await loadCandidates();
  };

  const closeWheel = () => {
    if (isSpinning) return;
    setIsOpen(false);
  };

  const spin = () => {
    if (isSpinning || candidates.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    const winnerIndex = Math.floor(Math.random() * candidates.length);

    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5–7
    const targetAngle = winnerIndex * sliceAngle + sliceAngle / 2; // κέντρο φέτας
    const finalRotation = fullSpins * 360 + (360 - targetAngle);

    setRotation(finalRotation);

    setTimeout(() => {
      setWinner(candidates[winnerIndex]);
      setIsSpinning(false);
    }, 2600);
  };

  // Helpers για SVG slice path
  const cx = 310;
  const cy = 310;
  const r = 310;

  const polar = (angDeg) => {
    const rad = (Math.PI / 180) * angDeg;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const slicePathD = (idx) => {
    const start = idx * sliceAngle - 90; // ξεκινάει από πάνω
    const end = (idx + 1) * sliceAngle - 90;

    const p1 = polar(start);
    const p2 = polar(end);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    return [
      `M ${cx} ${cy}`,
      `L ${p1.x} ${p1.y}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
      "Z",
    ].join(" ");
  };

  return (
    <>
      {/* Κουμπί που μπαίνει στη σελίδα κατηγορίας */}
      <button className="wheel-open-btn" onClick={openWheel}>
        🎡 Τροχός
      </button>

      {isOpen && (
        <div className="wheel-modal-overlay" onClick={closeWheel}>
          <div className="wheel-modal" onClick={(e) => e.stopPropagation()}>

            <div className="wheel-header">
              <h3>{title}</h3>
              <button className="wheel-close" onClick={closeWheel}>
                ✕
              </button>
            </div>

            {/* RIGHT: info panel */}
                       <div className="wheel-sideinfo">
                           <div className="wheel-sideinfo-label">Movie</div>

                             <div className="wheel-sideinfo-title">
                                 {hovered ? hovered.title : "Hover a movie"}
                               </div>

                             <div className="wheel-sideinfo-rating">
                                 ⭐ {hovered?.vote_average != null ? hovered.vote_average.toFixed(1) : "—"}
                               </div>
                              </div>

            {loading && <p className="wheel-status">Φόρτωση ταινιών...</p>}

             {!loading && candidates.length > 0 && (
               <div className="wheel-layout">
                 {/* LEFT: wheel */}
                 <div className="wheel-area">
                   <div className="wheel-pointer" title="Here it stops">▼</div>

                   <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
                     {/* FULL POSTER REVEAL (behind slices) */}
                     <div
                       className={`wheel-full-poster ${hovered?.poster_path ? "show" : ""}`}
                       style={{
                         backgroundImage: hovered?.poster_path
                           ? `url(https://image.tmdb.org/t/p/w1280${hovered.poster_path})`
                           : "none",
                       }}
                     />



                     {/* SVG WHEEL */}
                     <svg className="wheel-svg" viewBox="0 0 620 620" width="620" height="620">
                       <defs>
                         {candidates.map((m, idx) => (
                           <clipPath key={`cp-${m.id}`} id={`slice-${m.id}`}>
                             <path d={slicePathD(idx)} />
                           </clipPath>
                         ))}
                       </defs>

                       {candidates.map((m, idx) => {
                         const isFaded = hovered && hovered.id !== m.id;
                         const poster = m.poster_path
                           ? `https://image.tmdb.org/t/p/w1280${m.poster_path}`
                           : null;

                         return (
                           <g
                             key={`sl-${m.id}`}
                             clipPath={`url(#slice-${m.id})`}
                             className={`wheel-slice-g ${isFaded ? "faded" : ""}`}
                             onMouseEnter={() => setHovered(m)}
                             onMouseLeave={() => setHovered(null)}
                           >
                             {!poster && (
                               <rect x="0" y="0" width="620" height="620" fill="#2c3e4d" />
                             )}

                             {poster && (
                               <image
                                 href={poster}
                                 x="0"
                                 y="0"
                                 width="620"
                                 height="620"
                                 preserveAspectRatio="xMidYMid slice"
                               />
                             )}

                             <path
                               d={slicePathD(idx)}
                               fill="none"
                               stroke="rgba(0,0,0,0.28)"
                               strokeWidth="2"
                             />
                           </g>
                         );
                       })}
                     </svg>
                   </div>
                 </div>


               </div>
             )}




            {!loading && candidates.length === 0 && (
              <p className="wheel-status">Δεν βρέθηκαν ταινίες για τον τροχό.</p>
            )}

            <div className="wheel-actions">
              <button
                className="wheel-btn"
                onClick={spin}
                disabled={loading || isSpinning || candidates.length < 2}
              >
                {isSpinning ? "Γυρίζει..." : "Γύρνα τον τροχό"}
              </button>

              <button
                className="wheel-btn secondary"
                onClick={loadCandidates}
                disabled={loading || isSpinning}
              >
                Ανανέωση Ταινιών
              </button>
            </div>

            {winner && (
              <div className="wheel-winner">
                <h4>🎬 Πρόταση:</h4>
                <MovieCard movie={winner} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MovieWheel;
