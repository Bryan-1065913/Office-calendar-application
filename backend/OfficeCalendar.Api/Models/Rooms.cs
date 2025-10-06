public class Rooms {
    public int id { get; set; }
    public string name { get; set; }
    public string room_number { get; set; }
    public int capacity { get; set; }
    public DateTime created_at { get; set; }

    public List<Room_bookings> room_bookings = new List<Room_bookings>();
    public List<Workplaces> workplaces = new List<Workplaces>();
}