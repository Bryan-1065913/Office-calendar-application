public class Users {
    public int id { get; set; }
    public int company_id { get; set; }
    public int department_id { get; set; }
    public int workplace_id { get; set; }
    public string first_name { get; set; }
    public string last_name { get; set; }
    public string email { get; set; }
    public string password_hash { get; set; }
    public string phone_number { get; set; }
    public string job_title { get; set; }
    public string role { get; set; }
    public DateTime created_at { get; set; }  

    public List<Attendeces> attendeces = new List<Attendeces>();
    public List<Event_participations> event_participations = new List<Event_participations>();
    public List<Room_bookings> room_bookings = new List<Room_bookings>();
}