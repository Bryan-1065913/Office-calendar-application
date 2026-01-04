// src/pages/Events/EventDetail.tsx (of waar deze file staat)
import Hero from '../../components/common/Hero/Hero';
import EventsDetail from '../../components/common/Event/EventDetail';

function EventDetail() {
    return (
        <>
            <Hero
                title="Office Calendar"
                subtitle="Plan your workweek and events in one place."
                backgroundImage="/src/assets/images/hero-background.png"
                height="500px"
            />
            <EventsDetail />
        </>
    );
}

export default EventDetail;