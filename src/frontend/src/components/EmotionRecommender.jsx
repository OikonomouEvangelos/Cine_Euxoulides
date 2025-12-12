import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigation hook
import './EmotionRecommender.css';

const EmotionRecommender = () => {
    const webcamRef = useRef(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // ✅ Initialize navigation

    // 1. Capture Image
    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            handleUpload(imageSrc);
        }
    }, [webcamRef]);

    // 2. Helper: Convert Base64 to File
    const dataURLtoBlob = (dataurl) => {
        const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    // 3. Upload & Get Recommendations
    const handleUpload = async (base64Image) => {
        setLoading(true);
        try {
            const blob = dataURLtoBlob(base64Image);
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            const formData = new FormData();
            formData.append("image", file);

            const response = await axios.post("http://localhost:8080/api/recommend/face", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMovies(response.data.results);
        } catch (error) {
            console.error("Error scanning face:", error);
            alert("Could not analyze emotion. Check backend console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="emotion-container">
            <h2>Scan Your Mood 🎭</h2>

            <div className="webcam-wrapper">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={350}
                    videoConstraints={{ facingMode: "user" }}
                />
            </div>

            <button onClick={capture} disabled={loading} className="scan-btn">
                {loading ? "Analyzing..." : "Get Movie Recommendations"}
            </button>

            {/* Display Results */}
            <div className="movie-grid">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="movie-card"
                        // ✅ Click to Navigate to Movie Details
                        onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                        <img
                            src={movie.poster_path
                                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                : "https://via.placeholder.com/200x300?text=No+Image"}
                            alt={movie.title}
                        />
                        <h3>{movie.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmotionRecommender;