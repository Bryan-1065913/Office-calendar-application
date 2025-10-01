using OfficeCalendar.Api.Models;

namespace OfficeCalendar.Api.Services 
{
    public interface iAuthServices
    {
        // contract to describe what to expect
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<RegisterResponse> RegisterAsync(RegisterRequest request);

    }
}