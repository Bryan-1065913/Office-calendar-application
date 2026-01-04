// src/components/common/EventsForm.tsx
import Hero from '../../components/common/Hero/Hero';
import EventForm from '../../components/common/EventForm/EventForm';

function EventsForm() {
    return (
        <>
            <Hero
                title="Office Calendar"
                subtitle="Plan your workweek and events in one place."
                backgroundImage="/src/assets/images/hero-background.png"
                height="500px"
            />
            <EventForm />
        </>
    );
}

export default EventsForm;