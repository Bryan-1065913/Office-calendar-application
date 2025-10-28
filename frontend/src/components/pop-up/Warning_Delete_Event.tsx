// useEffect, useState hook
import { useEffect, useState } from 'react';
//useFetchDelete custom hook
import { useFetchDelete } from '../../hooks/useFetchDelete'
import '/src/components/pop-up/Warning_Delete_Event.scss';

// Defines the structure of an event object and its attributes
interface Evenement {
  id: number;
  title: string;
  description?: string;
  startsAt: string;
  status: string;
  createdBy: number;
  deletedAt?: string | null;
  createdAt: string;
}


const Warning_Delete = () => {
  const [evenement, setEvenement] = useState<Evenement>();
  const [message, setMessage] = useState("");
  const [id, setId] = useState<number>();
  const [triggerDelete, setTriggerDelete] = useState(false);
  const { data, isLoading, error } = useFetchDelete<Evenement>({
        url: triggerDelete && id ? `http://localhost:5017/api/events/${id}` : "",
  });
  useEffect(() => {
    if(message){
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  useEffect(() => {
    window.scrollTo(610, 610);
  });
  useEffect(() => {
      if (data) {
        setEvenement(data);
        if(evenement !== undefined){
          setMessage(`${evenement.id} got deleted with title ${evenement.title}`);
        }
        setTriggerDelete(false);
    }
  }, [data]);


  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const WarningDelete = (e: React.FormEvent) => {
    // prevents the form from reloading the page which makes
    e.preventDefault();
    if (!id) {
        alert("Please enter a valid ID");
        return;
    }
    const del = confirm(`Confirm Delete Event ${id}?`);
    if(del == true){
      alert("deleted")
      setTriggerDelete(true);
    }
    else if(del == false)
    {
      alert("Not Deleted")
    }
    else 
    {
      alert("wrong button")
    }
  }
  return (
    <div className="main">
        <div className="Border-line-event"></div>
        <div className="inner-event">
            <form>
                <p><strong>Delete an Event</strong></p>
                <label className="field_Id">Id    :</label>
                <input className="field_1" type="number" value={id ?? ""} onChange={(e) => setId(Number(e.target.value))} />
                <br></br>
                <button type="submit" className="delete_Button" onClick={WarningDelete}><strong>Delete</strong></button>
            </form>
        </div>
        {message && (
          <div className="warningMessage" >
            {message}
          </div>
        )}
    </div>
  );
};

export default Warning_Delete;