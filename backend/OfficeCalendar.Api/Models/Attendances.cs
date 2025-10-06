public class Attendances {
    public int id { get; set; }
    public int user_id { get; set; }
    public DateTime day { get; set; }
    public DateTime check_time { get; set; }
    public string place { get; set; }
    public string note { get; set; }
    public DateTime created_at { get; set; }
}