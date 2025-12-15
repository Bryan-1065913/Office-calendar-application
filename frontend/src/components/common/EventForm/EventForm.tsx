import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import "../../../styles/Event/EventForm.css";
import Button from "../UI/Buttons";
import Chevron from "../../../assets/icons/chevron.svg?react";

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
    const [eventFormData, setEventFormData] = useState<EventFormData>({
        name: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setEventFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(eventFormData);
        onSuccess?.();
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
                <div className="event-form-location-wrapper">
                    <input
                        id="location"
                        name="location"
                        type="text"
                        className="event-form-input event-form-location-input"
                        placeholder="Choose the location of the event"
                        value={eventFormData.location}
                        onChange={handleChange}
                        required
                    />
                    <Chevron className="event-form-location-chevron" />
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