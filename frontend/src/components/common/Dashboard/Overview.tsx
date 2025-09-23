// src/components/common/Dashboard/Overview.tsx
import "/src/styles/Dashboard/overview.css";

const Overview = () => {
    return (
        <div>
            <h1>Welkom, <span className="NameGreeting">[Voornaam]</span>!</h1>
            <p>Vandaag: [hoeveelheid] meetings, [hoeveelheid] events, [ hoeveelheid] taken</p>
        </div>
    );
};

export default Overview;