import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import "../../../styles/Event/EventForm.css";
import Button from "../UI/Buttons";
import Chevron from "../../../assets/icons/chevron.svg?react";
import api from "../../../services/api";
import { useAuth } from "../../../authentication/AuthContext";

interface EventFormData {
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
}

interface EventFormProps {
    embedded?: boolean;
    onSuccess?: () => void;
    onCancel?: () => void;
}

function EventForm({ embedded = false, onSuccess, onCancel }: EventFormProps = {}) {
    const { user } = useAuth();
    const [eventFormData, setEventFormData] = useState<EventFormData>({
        name: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "Home",
    });
    const [locationOpen, setLocationOpen] = useState(false);
    const locationRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!locationOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                locationRef.current &&
                !locationRef.current.contains(event.target as Node)
            ) {
                setLocationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [locationOpen]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setEventFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
            console.error("Cannot create event: user not authenticated");
            return;
        }

        try {
            const { date, startTime, endTime, name, description } = eventFormData;

            const startsAt = new Date(`${date}T${startTime}:00`);
            const endsAt = new Date(`${date}T${endTime}:00`);

            const payload = {
                title: name,
                description,
                startsAt: startsAt.toISOString(),
                endsAt: endsAt.toISOString(),
                status: "Future",
                createdBy: user.userId,
            };

            await api.post("/events", payload);

            onSuccess?.();
        } catch (err) {
            console.error("Failed to create event", err);
        }
    };

    const handleCancel = () => {
        onCancel?.();
    };

    return (
        <form
            className={`event-form ${embedded ? "event-form-embedded" : ""}`}
            onSubmit={handleSubmit}
        >
            <div className="event-form-row">
                <label className="event-form-label" htmlFor="name">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="event-form-input"
                    placeholder="Enter the name of the event"
                    value={eventFormData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="event-form-row">
                <label className="event-form-label" htmlFor="description">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    className="event-form-input event-form-textarea"
                    placeholder="Enter the description of the event"
                    value={eventFormData.description}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="event-form-row event-form-row-inline">
                <div className="event-form-col">
                    <label className="event-form-label" htmlFor="date">
                        Date
                    </label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        className="event-form-input"
                        value={eventFormData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="event-form-col">
                    <label className="event-form-label" htmlFor="startTime">
                        Start time
                    </label>
                    <input
                        id="startTime"
                        name="startTime"
                        type="time"
                        className="event-form-input"
                        value={eventFormData.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="event-form-col">
                    <label className="event-form-label" htmlFor="endTime">
                        End time
                    </label>
                    <input
                        id="endTime"
                        name="endTime"
                        type="time"
                        className="event-form-input"
                        value={eventFormData.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="event-form-row">
                <label className="event-form-label" htmlFor="location">
                    Location
                </label>
                <div
                    className="event-form-location-wrapper"
                    ref={locationRef}
                    onClick={() => setLocationOpen((open) => !open)}
                >
                    <div className="event-form-input event-form-location-input event-form-location-display">
                        {eventFormData.location || "Choose the location of the event"}
                    </div>
                    <Chevron
                        className={`event-form-location-chevron ${
                            locationOpen ? "event-form-location-chevron-open" : ""
                        }`}
                    />
                    {locationOpen && (
                        <div className="event-form-location-dropdown">
                            <button
                                type="button"
                                className="event-form-location-option"
                                onClick={() => {
                                    setEventFormData((prev) => ({
                                        ...prev,
                                        location: "Home",
                                    }));
                                    setLocationOpen(false);
                                }}
                            >
                                Home
                            </button>
                            <button
                                type="button"
                                className="event-form-location-option"
                                onClick={() => {
                                    setEventFormData((prev) => ({
                                        ...prev,
                                        location: "Work",
                                    }));
                                    setLocationOpen(false);
                                }}
                            >
                                Work
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="event-form-actions">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    className="event-form-btn-cancel"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    className="event-form-btn-save"
                >
                    Save
                </Button>
            </div>
        </form>
    );
}

export default EventForm;