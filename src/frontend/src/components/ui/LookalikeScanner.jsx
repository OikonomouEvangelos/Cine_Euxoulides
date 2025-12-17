import React, { useState } from 'react';

// --- ΕΙΣΑΓΩΓΗ ΤΟΥ GIF ΑΠΟ ΤΑ ASSETS ---
// Βεβαιώσου ότι το αρχείο λέγεται 'scanning.gif' και είναι στον φάκελο 'src/assets'
import scanningGif from '../../assets/scanning.gif';

const LookalikeScanner = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  // Χρησιμοποιούμε το imported αρχείο
  const INTRO_GIF_URL = scanningGif;

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setShowIntro(true); // Ξεκινάει το GIF

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8080/api/lookalike/analyze", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // Καθυστέρηση 4.5 δευτερόλεπτα για να απολαύσει το GIF
        setTimeout(() => {
            setResult(data);
            setShowIntro(false);
            setLoading(false);
        }, 4500);

      } else {
        alert("Σφάλμα κατά την ανάλυση.");
        setLoading(false);
        setShowIntro(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Σφάλμα σύνδεσης.");
      setLoading(false);
      setShowIntro(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>

      <div style={{
        backgroundColor: '#1f2937', padding: '30px', borderRadius: '12px',
        width: '90%', maxWidth: '500px', position: 'relative',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: 'white', textAlign: 'center',
        border: '1px solid #374151', minHeight: '350px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}>

        {/* Κουμπί Κλεισίματος */}
        {!showIntro && (
            <button onClick={onClose} style={{
            position: 'absolute', top: '10px', right: '15px',
            background: 'transparent', border: 'none', color: '#9ca3af',
            fontSize: '1.5rem', cursor: 'pointer'
            }}>✕</button>
        )}

        {/* ---------------------------------------------------- */}
        {/* ΠΕΡΙΠΤΩΣΗ 1: ΠΑΙΖΕΙ ΤΟ GIF ΑΠΟ ΤΟ LOCAL FILE */}
        {/* ---------------------------------------------------- */}
        {showIntro ? (
            <div style={{ animation: 'fadeIn 0.5s' }}>
                <h3 style={{color: '#fbbf24', marginBottom: '20px', fontSize: '1.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                    WHO ARE YOU?
                </h3>
                <img
                    src={INTRO_GIF_URL}
                    alt="Scanning..."
                    style={{
                        width: '100%', maxWidth: '400px', height: 'auto',
                        borderRadius: '12px',
                        boxShadow: '0 0 25px rgba(251, 191, 36, 0.4)',
                        border: '2px solid #fbbf24'
                    }}
                />
            </div>
        ) : (

        /* ---------------------------------------------------- */
        /* ΠΕΡΙΠΤΩΣΗ 2: ΚΑΝΟΝΙΚΗ ΟΘΟΝΗ */
        /* ---------------------------------------------------- */
        <>
            {!result && <h2 style={{ marginBottom: '20px', color: '#f3f4f6' }}>Βρες τον σωσία σου!</h2>}

            {!result && (
                <div style={{ marginBottom: '25px' }}>
                    <input type="file" id="file-upload" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    <label htmlFor="file-upload"
                        style={{
                            display: 'inline-block', padding: '12px 24px', cursor: 'pointer',
                            borderRadius: '8px', backgroundColor: '#374151', border: '2px dashed #6b7280',
                            color: '#e5e7eb', fontWeight: '500', width: '80%'
                        }}>
                        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>📂</span>
                        {selectedFile ? 'Αλλαγή Φωτογραφίας' : 'Επιλογή Φωτογραφίας'}
                    </label>
                </div>
            )}

            {selectedImage && !result && (
              <div style={{ marginBottom: '20px' }}>
                <img src={selectedImage} alt="Preview"
                     style={{
                         width: '120px', height: '120px', objectFit: 'cover',
                         borderRadius: '50%', border: '3px solid #ef4444', margin: '0 auto'
                     }} />
              </div>
            )}

            {result && (
                <div style={{
                    backgroundColor: '#374151', padding: '20px', borderRadius: '10px',
                    marginBottom: '20px', border: '1px solid #4b5563', animation: 'fadeIn 0.8s'
                }}>
                    <h3 style={{ color: '#ef4444', margin: '0 0 20px 0', fontSize: '1.8rem' }}>
                        {result.name}
                    </h3>

                    <div style={{
                        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <span style={{color:'#9ca3af', marginBottom:'5px', fontSize:'0.9rem'}}>Εσύ</span>
                            <img src={selectedImage} alt="User"
                                style={{
                                    width: '100px', height: '100px', objectFit: 'cover',
                                    borderRadius: '50%', border: '3px solid #3b82f6'
                                }} />
                        </div>

                        <div style={{fontSize:'2rem', color:'#6b7280'}}>➜</div>

                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <span style={{color:'#9ca3af', marginBottom:'5px', fontSize:'0.9rem'}}>Σωσίας</span>
                            {result.imageUrl ? (
                                <img src={result.imageUrl} alt={result.name}
                                    style={{
                                        width: '100px', height: '100px', objectFit: 'cover',
                                        borderRadius: '50%', border: '3px solid #ef4444'
                                    }} />
                            ) : (
                                <div style={{width:'100px', height:'100px', borderRadius:'50%', background:'#4b5563'}}></div>
                            )}
                        </div>
                    </div>

                    <div style={{ width: '100%', backgroundColor: '#1f2937', borderRadius: '10px', height: '10px', marginBottom: '10px' }}>
                        <div style={{
                            width: `${result.similarity}%`, height: '100%',
                            backgroundColor: '#10b981', borderRadius: '10px',
                            transition: 'width 1s ease-in-out'
                        }}></div>
                    </div>
                    <p style={{ fontSize: '1.1rem', color: '#d1d5db' }}>
                        Ομοιότητα: <strong style={{color: '#10b981'}}>{result.similarity}%</strong>
                    </p>
                </div>
            )}

            {!result ? (
                <button onClick={handleScan} disabled={!selectedFile} style={{
                  backgroundColor: selectedFile ? '#ef4444' : '#4b5563',
                  color: 'white', border: 'none', padding: '12px 24px',
                  borderRadius: '6px', cursor: selectedFile ? 'pointer' : 'not-allowed',
                  width: '100%', fontWeight: 'bold', fontSize: '1.1rem'
                }}>
                  Ανακάλυψε τον ηθοποιό
                </button>
            ) : (
                <button onClick={() => {setSelectedImage(null); setSelectedFile(null); setResult(null);}} style={{
                    backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px',
                    borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold'
                }}>
                    Δοκίμασε άλλη φωτογραφία
                </button>
            )}
        </>
        )}

      </div>
    </div>
  );
};

export default LookalikeScanner;