import type {ChangeEvent, FormEvent} from 'react';
import { useState } from 'react';
import {Form, Button, FormControl} from 'react-bootstrap';

interface eventFormData {
  name: string;
  description: string;
  place: string;
  date: string
}

function EventForm() {
  const [eventFormData, setEventFormData] = useState<eventFormData>({
    name: "",
    description: "",
    place: "",
    date: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEventFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(eventFormData);
  }

  return (
    <div className='d-flex flex-column gap-4  justify-content-center align-items-center'
    style={{height: '100vh'}}>
      <h2 >Event form</h2>
      <div className='d-flex justify-content-center align-items-center' >
        <form onSubmit={handleSubmit} style={{width: '600px', margin: '0 auto', backgroundColor: "#80CED7", padding: "10px", borderRadius: '5px'}}>
          <div className="form-group mb-3">
            <Form.Label>Name</Form.Label>
            <FormControl
              type="text"
              name="name"
              value={eventFormData.name}
              onChange={handleChange}
              placeholder="Enter the name of the event"
              required/>
          </div>
          <div className="form-group mb-3">
              <Form.Label>Description</Form.Label>
              <FormControl
                type="text"
                name="description"
                value={eventFormData.description}
                onChange={handleChange}
                placeholder="Enter the description of the event"
                required/>
          </div>
          <div className="form-group mb-3">
              <Form.Label>Place</Form.Label>
              <FormControl
                type="text"
                name="place"
                value={eventFormData.place}
                onChange={handleChange}
                placeholder="Enter the place of the event"
                required/>
          </div>
          <div className="form-group mb-3">
              <Form.Label>Date</Form.Label>
              <FormControl
                type="text"
                name="date"
                value={eventFormData.date}
                onChange={handleChange}
                placeholder="Enter the date of the event"
                required/>
          </div>
          <Button type="submit" variant="primary" style={{backgroundColor: '#263D42', border: 'none'}}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  )

}

export default EventForm;