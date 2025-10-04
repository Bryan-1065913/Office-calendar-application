// src/App.tsx
import { Outlet } from 'react-router';

export default function App() {
    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
}