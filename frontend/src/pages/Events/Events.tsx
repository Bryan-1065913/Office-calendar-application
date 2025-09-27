// src/App.tsx
import Layout from '../../components/common/Layout/Layout.tsx';
import Hero from '../../components/common/Hero/Hero.tsx';
import Events from '../../components/common/Overzicht/EventsComponent.tsx';

function App() {
    return (
            <Layout>
                <Hero
                    title="Office Calendar"
                    subtitle="Plan your workweek and events in one place."
                    backgroundImage="/src/assets/images/hero-background.png"
                    height="500px"
                />
                <Events />
            </Layout>
    );
}

export default App;