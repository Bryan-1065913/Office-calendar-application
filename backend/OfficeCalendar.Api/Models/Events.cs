public class Events{
    public int id { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public DateTime starts_at { get; set; }
    public string status { get; set; }
    public int created_by { get; set; }
    public DateTime deleted_at { get; set; }
    public DateTime created_at { get; set; }

    public List<Event_participations> event_participations = new List<Event_participations>();
    
}