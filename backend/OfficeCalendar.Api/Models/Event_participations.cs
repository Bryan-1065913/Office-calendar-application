public class Event_participations {
    public int id { get; set; }
    public int event_id { get; set; }
    public int user_id { get; set; }
    public string status { get; set; }
    public DateTime created_at {get; set; }
}