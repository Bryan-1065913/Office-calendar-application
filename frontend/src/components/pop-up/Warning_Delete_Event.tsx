import { useEffect, useState } from 'react';
import '/src/components/pop-up/Warning_Delete_Event.scss';




const Warning_Delete = () => {
  const [id, setId] = useState<number>();
  function WarningDelete(): undefined{
    const del = confirm(`Confirm Delete Event ${id}?`);
    if(del == true){
      alert("deleted")
      // api delete here
    }
    else if(del == false)
    {
      alert("Not Deleted")
    }
    else 
    {
      alert("wrong button");
    }
  }
  useEffect(() => {
          window.scrollTo(610, 610);
      });
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
    </div>
  );
};

export default Warning_Delete;