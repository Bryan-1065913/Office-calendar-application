// src/App.tsx
import Layout from '../../components/common/Layout/Layout.tsx';
import Hero from '../../components/common/Hero/Hero.tsx';
import EventsDetail from '../../components/common/Event/EventDetail.tsx';

function EventDetail() {
    return (
            <Layout>
                <Hero
                    title="Office Calendar"
                    subtitle="Plan your workweek and events in one place."
                    backgroundImage="/src/assets/images/hero-background.png"
                    height="500px"
                />
                <EventsDetail />
            </Layout>
    );
}

export default EventDetail;