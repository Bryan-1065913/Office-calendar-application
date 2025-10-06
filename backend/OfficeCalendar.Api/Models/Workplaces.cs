public class Workplaces{
    public int id { get; set; }
    public string code { get; set; }
    public int room_id { get; set; }
    public string note { get; set; }
    public DateTime created_at { get; set; }
    
    public List<Users> users = new List<Users>();
}