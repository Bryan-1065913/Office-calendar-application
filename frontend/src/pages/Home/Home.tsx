// src/Home/Home.tsx
import Hero from '../../components/common/Hero/Hero';

function Home() {
    return (
        <Hero
            title="Office Calendar"
            subtitle="Plan your workweek and events in one place."
            backgroundImage="/src/assets/images/hero-background.png"
            height="500px"
        />
    );
}

export default Home;