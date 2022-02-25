using Pomelo.EntityFrameworkCore.MySql;
using Microsoft.EntityFrameworkCore;
using ExamManager.Models;
using Microsoft.AspNetCore.Mvc;
using ExamManager.Services;

namespace ExamManager.DAO
{
    public class ApplicationDBContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }

        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options,
                                    [FromServices] ISecurityService securitySerice) : base(options)
        {
            Database.EnsureCreated();

            // При отсутствии пользователей в БД, создается
            // администратор с логином и паролем по умолчанию
            if (!Users?.Any() ?? false)
            {
                Users!.Add(new User
                {
                    Login = "admin",
                    PasswordHash = securitySerice.Encrypt("admin"),
                    FirstName = "Имя",
                    MiddleName = "Фамилия",
                    Role = UserRole.ADMIN
                });
                SaveChanges();
            }
        }
    }
}
