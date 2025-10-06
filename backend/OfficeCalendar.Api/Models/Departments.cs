public class Departments{
    public int id { get; set; }
    public int company_id { get; set; }
    public string name { get; set; }
    public string role_description { get; set; }
    public int employee_count { get; set; }
    public DateTime created_at { get; set; }

    public List<Users> users = new List<Users>();
}