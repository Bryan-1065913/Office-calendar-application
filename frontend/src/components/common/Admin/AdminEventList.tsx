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

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h5 className="mb-0">All Events</h5>
                    <input
                        type="text"
                        className="form-control"
                        style={{ maxWidth: '250px' }}
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="users-scroll">
                    {filteredEvents.length === 0 ? (
                        <p className="text-center text-muted py-4">No events found</p>
                    ) : (
                        filteredEvents.map(e => (
                            <div key={e.id} className="d-flex align-items-center gap-3 p-3 border-bottom">
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <span className="fw-semibold">{e.title}</span>
                                    </div>
                                    {e.description && (
                                        <p className="text-muted mb-1 small">{e.description}</p>
                                    )}
                                    <p className="text-muted mb-0 small">
                                        {formatDate(e.startsAt)} - {formatDate(e.endsAt)}
                                    </p>
                                    {e.room && (
                                        <p className="text-muted mb-0 small">
                                            Room: {e.room.name} {e.room.roomNumber ? `(${e.room.roomNumber})` : ''}
                                        </p>
                                    )}
                                </div>

                                <div className="d-flex gap-2">
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
        </div>
    );
};

export default AdminEventsList;