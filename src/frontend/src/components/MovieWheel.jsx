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

  const sliceAngle = useMemo(() => {
    return candidates.length ? 360 / candidates.length : 0;
  }, [candidates.length]);

  // Φτιάχνει conic-gradient με εναλλαγή 2 χρωμάτων (σταθερά, χωρίς nth-child)
  const wheelBackground = useMemo(() => {
    if (!candidates.length) return "transparent";

    const c1 = "#2c3e4d";
    const c2 = "#6f8797";

    const parts = candidates.map((_, i) => {
      const start = i * sliceAngle;
      const end = (i + 1) * sliceAngle;
      const col = i % 2 === 0 ? c1 : c2;
      return `${col} ${start}deg ${end}deg`;
    });

    return `conic-gradient(from -90deg, ${parts.join(", ")})`;
    // from -90deg => “0 μοίρες” να ξεκινάει από πάνω (εκεί που είναι ο δείκτης)
  }, [candidates.length, sliceAngle]);

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

    // Στόχος: να “κάτσει” το κέντρο της νικητήριας φέτας ακριβώς στο pointer (πάνω).
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5–7
    const targetAngle = winnerIndex * sliceAngle + sliceAngle / 2;

    // Επειδή ο pointer είναι “πάνω” και βάλαμε from -90deg στο gradient,
    // κρατάμε το ίδιο μαθηματικό: σταμάτα ώστε το targetAngle να έρθει στο 0deg (πάνω).
    const finalRotation = fullSpins * 360 + (360 - targetAngle);

    setRotation(finalRotation);

    setTimeout(() => {
      setWinner(candidates[winnerIndex]);
      setIsSpinning(false);
    }, 2600);
  };

  return (
    <>
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

            {loading && <p className="wheel-status">Φόρτωση ταινιών...</p>}

            {!loading && candidates.length > 0 && (
              <div className="wheel-area">
                <div className="wheel-pointer" title="Εδώ σταματάει">▼</div>

                <div
                  className="wheel"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    background: wheelBackground,
                  }}
                >
                  {/* LABELS */}
                  {candidates.map((m, idx) => {
                    const angle = idx * sliceAngle + sliceAngle / 2;
                    return (
                      <span
                        key={`lbl-${m.id}`}
                        className="wheel-label"
                        title={m.title}
                        style={{
                          // rotate(angle) => πάει στη σωστή φέτα
                          // translateY(-radius) => πάει προς τα έξω
                          // rotate(90deg) => να είναι οριζόντια (όχι κάθετα/ανάποδα)
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-235px) rotate(90deg)`,
                        }}
                      >
                        {m.title}
                      </span>
                    );
                  })}
              {/* THUMBS (poster thumbnails) */}
              {candidates.map((m, idx) => {
                const angle = idx * sliceAngle + sliceAngle / 2;
                const poster = m.poster_path
                  ? `https://image.tmdb.org/t/p/w185${m.poster_path}`
                  : null;

                if (!poster) return null;

                return (
                  <img
                    key={`th-${m.id}`}
                    className="wheel-thumb"
                    src={poster}
                    alt={m.title}
                    title={m.title}
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-250px) rotate(-${angle}deg)`,
                    }}
                    loading="lazy"
                  />
                );
              })}

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
