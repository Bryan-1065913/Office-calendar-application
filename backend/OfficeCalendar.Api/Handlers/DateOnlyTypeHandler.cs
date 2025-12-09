// Handlers/DateOnlyTypeHandler.cs
using System.Data;
using Dapper;

namespace OfficeCalendar.Api.Handlers
{
    public class DateOnlyTypeHandler : SqlMapper.TypeHandler<DateOnly>
    {
        public override DateOnly Parse(object value)
        {
            if (value is DateTime dateTime)
            {
                return DateOnly.FromDateTime(dateTime);
            }
            if (value is string dateString)
            {
                return DateOnly.Parse(dateString);
            }
            throw new InvalidCastException($"Cannot convert {value.GetType()} to DateOnly");
        }

        public override void SetValue(IDbDataParameter parameter, DateOnly value)
        {
            parameter.DbType = DbType.Date;
            parameter.Value = value.ToDateTime(TimeOnly.MinValue);
        }
    }
}