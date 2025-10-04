// src/Home/Home.tsx
import Layout from '../../components/common/Layout/Layout';
import Hero from '../../components/common/Hero/Hero';
import EventForm from '../../components/common/EventForm/EventForm'

function EventsForm() {
    return (
        // probably cause only admins can make an event it needs the admin layout.
        // admin layout should be created as well.
        <Layout>
            <Hero
                title="Office Calendar"
                subtitle="Plan your workweek and events in one place."
                backgroundImage="/src/assets/images/hero-background.png"
                height="500px"
            />
            <EventForm/>
        </Layout>
    );
}

export default EventsForm;