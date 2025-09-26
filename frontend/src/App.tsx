// src/App.tsx
import Layout from './components/common/Layout/Layout';
import Hero from './components/common/Hero/Hero';
import Events from './components/common/Overzicht/Events';
import EventDetails from './components/events/EventDetails';
import EventForm from './pages/EventForm';
import { BrowserRouter as Routers, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <Routers>
            <Layout>
                <Hero
                    title="Office Calendar"
                    subtitle="Plan your workweek and events in one place."
                    backgroundImage="/src/assets/images/hero-background.png"
                    height="500px"
                />
                <Routes>
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/eventform" element={<EventForm/>}/>
                </Routes>
            </Layout>
        </Routers>
    );
}

export default App;