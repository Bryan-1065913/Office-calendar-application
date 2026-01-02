// src/components/common/Admin/AdminEventsList.tsx
import { useState } from 'react';
import Button from '../UI/Buttons';
import '../../../styles/Admin/UsersList.css';

interface Event {
    id: number;
    title: string;
    description?: string;
    startsAt: string;
    endsAt: string;
    createdBy: number;
    room?: {
        name: string;
        roomNumber?: string;
    };
}

interface AdminEventsListProps {
    events: Event[];
    onDelete: (id: number) => void;
}

const AdminEventsList = ({ events, onDelete }: AdminEventsListProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter events op search
    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format datum voor weergave
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // ✅ Get alleen de dag voor in de avatar
    const getDay = (dateString: string) => {
        const date = new Date(dateString);
        return date.getDate(); // Returns 1-31
    };

    return (
        <div className="users-card">
            {/* Card Header */}
            <div className="card-header">
                <h2>All Events</h2>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* event list */}
            <div className="users-list">
                {filteredEvents.length === 0 ? (
                    <p className="no-users">No events found</p>
                ) : (
                    filteredEvents.map(e => (
                        <div key={e.id} className="user-item">
                            {/* ✅ Event avatar met dag nummer + zelfde kleur als users */}
                            <div className="user-avatar">
                                {getDay(e.startsAt)}
                            </div>

                            {/* Event info */}
                            <div className="user-info">
                                <div className="user-name-row">
                                    <span className="user-name">{e.title}</span>
                                </div>
                                {e.description && (
                                    <p className="user-email">{e.description}</p>
                                )}
                                <p className="user-job">
                                    {formatDate(e.startsAt)} - {formatDate(e.endsAt)}
                                </p>
                                {e.room && (
                                    <p className="user-job">
                                        Room: {e.room.name} {e.room.roomNumber ? `(${e.room.roomNumber})` : ''}
                                    </p>
                                )}
                            </div>

                            {/* Action button */}
                            <div className="user-actions">
                                <Button
                                    variant="danger"
                                    onClick={() => onDelete(e.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminEventsList;