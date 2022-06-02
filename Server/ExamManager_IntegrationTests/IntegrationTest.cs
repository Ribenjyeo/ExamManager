using ExamManager.DAO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ExamManager.Models;
using ExamManager.Models.Response;

namespace ExamManager_IntegrationTests
{
    public class IntegrationTest
    {
        protected readonly HttpClient TestClient;

        protected IntegrationTest()
        {
            var appFactory = new WebApplicationFactory<Program>()
                .WithWebHostBuilder(builder =>
                {
                    builder.ConfigureServices(services =>
                    {
                        services.RemoveAll(typeof(ExamManagerDBContext));
                        services.AddDbContext<ExamManagerDBContext>(options => { options.UseInMemoryDatabase("ExamManagerDb"); });
                    });
                });

            TestClient = appFactory.CreateClient();
        }

        protected async Task AuthenticateAsync()
        {
            TestClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", await GetJwtAsync());
        }

        private async Task<string> GetJwtAsync()
        {
            var response = await TestClient.PostAsJsonAsync(Routes.Login, new LoginEditModel
            {
                Login = "admin",
                Password = "admin"
            });

            var registrationResponse = await response.Content.ReadAsAsync<JWTResponse>();
            return registrationResponse.token;
        }
    }
}