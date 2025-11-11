namespace OfficeCalendar.Api.Services;

public class SqlQueryService
{
    private readonly Dictionary<string, string> _queries = new();

    public SqlQueryService()
    {
        LoadQueries();
    }

    private void LoadQueries()
    {
        var sqlPath = Path.Combine(AppContext.BaseDirectory, "Sql");
        
        
        if (!Directory.Exists(sqlPath))
        {
            Console.WriteLine($"Warning: SQL directory not found at {sqlPath}");
            return;
        }

        var sqlFiles = Directory.GetFiles(sqlPath, "*.sql", SearchOption.AllDirectories);
        
        foreach (var file in sqlFiles)
        {
            var fileName = Path.GetFileNameWithoutExtension(file);
            var query = File.ReadAllText(file);
            _queries[fileName] = query;
            Console.WriteLine($"Loaded SQL query: {fileName}");
        }
    }

    public string GetQuery(string queryName)
    {
        if (_queries.TryGetValue(queryName, out var query))
        {
            return query;
        }
        
        throw new FileNotFoundException($"SQL query '{queryName}' not found");
    }

    public Task<string> GetQueryAsync(string queryName)
    {
        return Task.FromResult(GetQuery(queryName));
    }
}