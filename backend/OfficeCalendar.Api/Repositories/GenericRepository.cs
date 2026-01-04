// Repositories/GenericRepository.cs
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;
using Dapper;
using OfficeCalendar.Api.Services;

namespace OfficeCalendar.Api.Repositories
{
    public class GenericRepository<T> where T : class
    {
        private readonly DatabaseService _db;
        private readonly string _tableName;

        public GenericRepository(DatabaseService db)
        {
            _db = db;
            _tableName = GetTableName();
        }

        // Haal de tabel naam op uit het [Table] attribute
        private string GetTableName()
        {
            var tableAttribute = typeof(T).GetCustomAttribute<TableAttribute>();
            if (tableAttribute != null)
            {
                return tableAttribute.Name;
            }
            // Fallback: gebruik class naam + 's'
            return typeof(T).Name.ToLower() + "s";
        }

        // GET ALL
        public async Task<List<T>> GetAllAsync()
        {
            using var connection = _db.GetConnection();
            var sql = $"SELECT * FROM {_tableName}";
            var result = await connection.QueryAsync<T>(sql);
            return result.ToList();
        }

        // GET BY ID
        public async Task<T?> GetByIdAsync(int id)
        {
            using var connection = _db.GetConnection();
            var sql = $"SELECT * FROM {_tableName} WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<T>(sql, new { Id = id });
        }

        // INSERT
        public async Task<int> InsertAsync(T entity)
        {
            using var connection = _db.GetConnection();
            
            var properties = typeof(T).GetProperties()
                .Where(p => p.Name != "Id" && p.GetCustomAttribute<ColumnAttribute>() != null)
                .ToList();

            var columns = string.Join(", ", properties.Select(p => 
                p.GetCustomAttribute<ColumnAttribute>()?.Name ?? p.Name.ToLower()));
            
            var parameters = string.Join(", ", properties.Select(p => $"@{p.Name}"));

            var sql = $@"
                INSERT INTO {_tableName} ({columns})
                VALUES ({parameters})
                RETURNING id";

            return await connection.QuerySingleAsync<int>(sql, entity);
        }

        // UPDATE
        public async Task<bool> UpdateAsync(int id, T entity)
        {
            using var connection = _db.GetConnection();
            
            var properties = typeof(T).GetProperties()
                .Where(p => p.Name != "Id" && p.GetCustomAttribute<ColumnAttribute>() != null)
                .ToList();

            var setClause = string.Join(", ", properties.Select(p =>
            {
                var columnName = p.GetCustomAttribute<ColumnAttribute>()?.Name ?? p.Name.ToLower();
                return $"{columnName} = @{p.Name}";
            }));

            var sql = $"UPDATE {_tableName} SET {setClause} WHERE id = @Id";

            var parameters = new DynamicParameters(entity);
            parameters.Add("Id", id);

            var rowsAffected = await connection.ExecuteAsync(sql, parameters);
            return rowsAffected > 0;
        }

        // DELETE
        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _db.GetConnection();
            var sql = $"DELETE FROM {_tableName} WHERE id = @Id";
            var rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        // CUSTOM DELETE QUERY EventParticipations
        public async Task<bool> DeleteEventParticipationAsync(int userId, int eventId)
        {
            using var connection = _db.GetConnection();
            var sql = $"DELETE FROM {_tableName} WHERE user_id = @UserId AND event_id = @EventId";
            var rowsAffected = await connection.ExecuteAsync(sql, new { UserId = userId, EventId = eventId });
            return rowsAffected > 0;
        }
        
        // CUSTOM QUERY
        public async Task<List<T>> QueryAsync(string sql, object? parameters = null)
        {
            using var connection = _db.GetConnection();
            var result = await connection.QueryAsync<T>(sql, parameters);
            return result.ToList();
        }

        // SINGLE CUSTOM QUERY
        public async Task<T?> QueryFirstOrDefaultAsync(string sql, object? parameters = null)
        {
            using var connection = _db.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<T>(sql, parameters);
        }

        // COUNT
        public async Task<int> CountAsync(string? whereClause = null, object? parameters = null)
        {
            using var connection = _db.GetConnection();
            var sql = $"SELECT COUNT(*) FROM {_tableName}";
            
            if (!string.IsNullOrEmpty(whereClause))
            {
                sql += $" WHERE {whereClause}";
            }

            return await connection.ExecuteScalarAsync<int>(sql, parameters);
        }
    }
}