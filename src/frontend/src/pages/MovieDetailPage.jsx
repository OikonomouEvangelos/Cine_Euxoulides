import React from 'react';
// Υποθέτουμε ότι τα components είναι στο src/frontend/src/components/

import DetailTabs from '../components/ui/DetailTabs';
import './MovieDetailPage.css';

import RatingSection from '../components/ui/RatingSection';

const MovieDetailPage = () => {
    // Placeholder data για την εμφάνιση και τη δομή
    const movie = {
        title: "Τίτλος Ταινίας",
        imageUrl: "https://via.placeholder.com/1200x500?text=Movie+Poster+Background", // Χρησιμοποιήστε ένα πραγματικό URL
        description: "Αυτή είναι η σύντομη περιγραφή της ταινίας, με βασικά στοιχεία πλοκής και κριτικές. Εδώ μπορεί να εμφανίζεται και η διάρκεια, η χρονιά και το genre.",
        tagline: "Μια ιστορία που θα σας καθηλώσει."
    };

    return (
        <div className="movie-detail-container">
            {/* 1. Ενότητα Hero Section (Πιάνει όλο το πάνω μέρος) */}
            <section className="movie-hero-section">

                {/* Το div με την εικόνα ως background και το εφέ σκίασης */}
                <div
                    className="hero-background"
                    style={{ backgroundImage: `url(${movie.imageUrl})` }}
                >
                    <div className="hero-content">
                        {/* Τίτλος Ταινίας */}
                        <h1>{movie.title}</h1>

                        {/* Σύντομη Περιγραφή */}
                        <p className="movie-tagline">{movie.description}</p>

                        <button className="btn-trailer">Προβολή Trailer</button>
                    </div>
                </div>
            </section>

            {/* 2. Ενότητα Interactive Content (Διάταξη 2 Στηλών) */}
            <section className="interactive-content">

                {/* Αριστερή Στήλη: Βαθμολόγηση - Μέχρι τη μέση της οθόνης */}
                <div className="rating-column">
                   <RatingSection />
                </div>

                {/* Δεξιά Στήλη: Σχόλια - Στο ίδιο μέγεθος με τη βαθμολόγηση */}
                <div className="comment-column">
                    <section className="comment-section">
                        <h3>Σχολιάστε την ταινία</h3>
                        <textarea placeholder="Γράψτε το σχόλιό σας..." rows="4"></textarea>
                        <button className="btn-secondary">Υποβολή Σχολίου</button>
                    </section>
                </div>

            </section>

            {/* 3. Οριζόντιο Μενού/Tabs (Cast, Crew, Details) */}
            <DetailTabs />

            {/* 4. Περιοχή Περιεχομένου Tabs */}
            <div className="tab-content">
                <p>Δεδομένα Cast/Crew/Details θα φορτωθούν εδώ βάσει του επιλεγμένου tab.</p>
            </div>
        </div>
    );
};

export default MovieDetailPage;