public class Companies{
    public int id { get; set; }
    public string name { get; set; }
    public string address { get; set; }
    public DateTime created_at { get; set; }

    public List<Departments> departments = new List<Departments>();
    public List<Users> users = new List<Users>();
}