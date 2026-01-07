import React, { useMemo, useState, useEffect } from "react";
import "./MovieWheel.css";
import { useNavigate } from "react-router-dom";

// Fisher–Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// LOCKED STAGE SIZE (must match your CSS .wheel-modal width/height)
const STAGE_W = 1500;
const STAGE_H = 860;

const MovieWheel = ({ genreId, title = "Δεν ξέρεις τι να δεις;" }) => {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [locked, setLocked] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ scale must be INSIDE component
  const [scale, setScale] = useState(1);

  // ✅ always scale down to fit laptop screen + leave margin so you can close
  useEffect(() => {
    const updateScale = () => {
      const vw = window.visualViewport?.width ?? window.innerWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;

      const margin = 120; // bigger margin = always space to click overlay / see X
      const sW = (vw - margin) / STAGE_W;
      const sH = (vh - margin) / STAGE_H;

      const s = Math.max(0.1, Math.min(sW, sH, 1)); // never bigger than 1
      setScale(s);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    window.visualViewport?.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      window.visualViewport?.removeEventListener("resize", updateScale);
    };
  }, []);

  const sliceAngle = useMemo(
    () => (candidates.length ? 360 / candidates.length : 0),
    [candidates.length]
  );

  const loadCandidates = async () => {
    if (!API_KEY || !genreId) return;

    setLoading(true);
    setWinner(null);
    setHovered(null);
    setLocked(false);

    try {
      const firstRes = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=el-GR&with_genres=${genreId}&sort_by=popularity.desc&page=1&include_adult=false`
      );
      const firstData = await firstRes.json();

      const totalPages = Math.min(firstData?.total_pages || 1, 50);
      const randomPage = Math.floor(Math.random() * totalPages) + 1;

      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=el-GR&with_genres=${genreId}&sort_by=popularity.desc&page=${randomPage}&include_adult=false`
      );
      const data = await res.json();

      const ten = shuffle((data.results || []).filter((m) => m.poster_path)).slice(
        0,
        10
      );

      setCandidates(ten);
      setRotation(0);
    } catch (e) {
      console.error(e);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const spin = () => {
    if (isSpinning || candidates.length < 2) return;

    setIsSpinning(true);
    setWinner(null);
    setHovered(null);
    setLocked(false);

    const winnerIndex = Math.floor(Math.random() * candidates.length);
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const targetAngle = winnerIndex * sliceAngle + sliceAngle / 2;
    const finalRotation = fullSpins * 360 + (360 - targetAngle);

    setRotation(finalRotation);

    setTimeout(() => {
      const w = candidates[winnerIndex];
      setWinner(w);
      setHovered(w);
      setLocked(true);
      setIsSpinning(false);
    }, 2600);
  };

  const cx = 310,
    cy = 310,
    r = 310;
  const polar = (a) => {
    const rad = (Math.PI / 180) * a;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const slicePathD = (i) => {
    const s = i * sliceAngle - 90;
    const e = (i + 1) * sliceAngle - 90;
    const p1 = polar(s),
      p2 = polar(e);
    return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${
      sliceAngle > 180 ? 1 : 0
    } 1 ${p2.x} ${p2.y} Z`;
  };

  return (
    <>
      <button
        className="wheel-open-btn"
        onClick={() => {
          setIsOpen(true);
          loadCandidates();
        }}
      >
        🎡 Τροχός
      </button>

      {isOpen && (
        <div className="wheel-modal-overlay" onClick={() => setIsOpen(false)}>
          {/* SCALE WRAPPER (scales EVERYTHING together) */}
          <div
            className="wheel-stage-wrap"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* FIXED STAGE */}
            <div className="wheel-modal">
              <div className="wheel-header">
                <h3>{title}</h3>
                <button className="wheel-close" onClick={() => setIsOpen(false)}>
                  ✕
                </button>
              </div>

              <div className="wheel-sideinfo">
                <div className="wheel-sideinfo-label">Movie</div>
                <div className="wheel-sideinfo-title">
                  {hovered ? hovered.title : "Hover a movie"}
                </div>
                <div className="wheel-sideinfo-rating">
                  ⭐ {hovered?.vote_average?.toFixed(1) ?? "—"}
                </div>
              </div>

              {!loading && candidates.length > 0 && (
                <div className="wheel-area">
                  <div
                    className={`wheel ${(winner || hovered) ? "clickable" : ""}`}
                    style={{ transform: `rotate(${rotation}deg)` }}
                    onClick={() => {
                      const target = winner || hovered;
                      if (target?.id) navigate(`/movie/${target.id}`);
                    }}
                  >
                    <div
                      className={`wheel-full-poster ${hovered ? "show" : ""}`}
                      style={{
                        backgroundImage: hovered
                          ? `url(https://image.tmdb.org/t/p/w1280${hovered.poster_path})`
                          : "none",
                      }}
                    />

                    <svg className="wheel-svg" viewBox="0 0 620 620">
                      <defs>
                        {candidates.map((m, i) => (
                          <clipPath key={m.id} id={`s-${m.id}`}>
                            <path d={slicePathD(i)} />
                          </clipPath>
                        ))}
                      </defs>

                      {candidates.map((m, i) => (
                        <g
                          key={m.id}
                          clipPath={`url(#s-${m.id})`}
                          className={`wheel-slice-g ${
                            hovered && hovered.id !== m.id ? "faded" : ""
                          }`}
                          onMouseEnter={() => !locked && setHovered(m)}
                          onMouseLeave={() => !locked && setHovered(null)}
                        >
                          <image
                            href={`https://image.tmdb.org/t/p/w1280${m.poster_path}`}
                            x="0"
                            y="0"
                            width="620"
                            height="620"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              )}

              <div className="wheel-actions">
                <button className="wheel-btn" onClick={spin} disabled={isSpinning}>
                  {isSpinning ? "Γυρίζει..." : "Γύρνα τον τροχό"}
                </button>
                <button
                  className="wheel-btn secondary"
                  onClick={loadCandidates}
                  disabled={isSpinning}
                >
                  Ανανέωση Ταινιών
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieWheel;
