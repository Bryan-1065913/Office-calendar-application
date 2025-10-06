public class Room_bookings {
    public int id { get; set; }
    public int room_id { get; set; }
    public int user_id { get; set; }
    public DateTime starts_at { get; set; }
    public DateTime ends_at { get; set; }
    public string purpose { get; set; }
    public DateTime created_at { get; set; }
}