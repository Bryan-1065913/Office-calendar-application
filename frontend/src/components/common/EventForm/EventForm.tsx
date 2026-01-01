import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import "../../../styles/Event/EventForm.css";
import Button from "../UI/Buttons";
import Chevron from "../../../assets/icons/chevron.svg?react";
import api from "../../../services/api";
import { useAuth } from "../../../authentication/AuthContext";

interface Room {
  id: number;
  name: string;
  roomNumber: string | null;
  capacity: number | null;
  createdAt: string;
}

interface EventFormData {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  roomId: number | null;
}

interface EventFormProps {
  embedded?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function EventForm({
  embedded = false,
  onSuccess,
  onCancel,
}: EventFormProps = {}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    roomId: null,
  });
  const [locationOpen, setLocationOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const locationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const response = await api.get<Room[]>("/rooms");
        setRooms(response.data);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

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

    if (!eventFormData.roomId) {
      alert("Please select a room for the event");
      return;
    }

    try {
      const { date, startTime, endTime, name, description, roomId } =
        eventFormData;

      const startsAt = new Date(`${date}T${startTime}:00`);
      const endsAt = new Date(`${date}T${endTime}:00`);

      // Create the event first
      const eventPayload = {
        title: name,
        description,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        status: "Future",
        createdBy: user.userId,
      };

      const eventResponse = await api.post("/events", eventPayload);
      const eventId = eventResponse.data.id || eventResponse.data.Id;

      // Create the room booking
      const roomBookingPayload = {
        roomId: roomId,
        userId: user.userId,
        eventId: eventId,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      };

      await api.post("/roombookings", roomBookingPayload);

      // If embedded, call onSuccess callback (which handles reload)
      // Otherwise, navigate to events page
      if (embedded && onSuccess) {
        onSuccess();
      } else {
        navigate("/events");
      }
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
              {loadingRooms ? (
                <div
                  className="event-form-location-option"
                  style={{ cursor: "default" }}
                >
                  Loading rooms...
                </div>
              ) : rooms.length === 0 ? (
                <div
                  className="event-form-location-option"
                  style={{ cursor: "default" }}
                >
                  No rooms available
                </div>
              ) : (
                rooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    className="event-form-location-option"
                    onClick={() => {
                      const displayName = room.roomNumber
                        ? `${room.name} (${room.roomNumber})`
                        : room.name;
                      setEventFormData((prev) => ({
                        ...prev,
                        location: displayName,
                        roomId: room.id,
                      }));
                      setLocationOpen(false);
                    }}
                  >
                    {room.roomNumber
                      ? `${room.name} (${room.roomNumber})`
                      : room.name}
                  </button>
                ))
              )}
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
        <Button type="submit" variant="primary" className="event-form-btn-save">
          Save
        </Button>
      </div>
    </form>
  );
}

export default EventForm;
