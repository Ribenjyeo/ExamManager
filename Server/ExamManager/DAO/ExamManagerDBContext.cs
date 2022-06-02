using Pomelo.EntityFrameworkCore.MySql;
using Microsoft.EntityFrameworkCore;
using ExamManager.Models;
using Microsoft.AspNetCore.Mvc;
using ExamManager.Services;

namespace ExamManager.DAO
{
    public class ExamManagerDBContext : DbContext
    {
        public DbSet<User>? Users { get; set; }
        public DbSet<Group>? Groups { get; set; }
        public DbSet<StudyTask>? Tasks { get; set; }
        public DbSet<PersonalTask>? UserTasks { get; set; }
        public DbSet<VirtualMachine>? VirtualMachines { get; set; }
        public DbSet<VirtualMachineImage>? VMImages { get; set; }

        public ExamManagerDBContext(DbContextOptions<ExamManagerDBContext> options,
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
                    LastName = "Фамилия",
                    Role = UserRole.ADMIN
                });
                SaveChanges();
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Конфигурация моделей
            modelBuilder.Entity<StudyTask>()
                .HasMany(st => st.PersonalTasks)
                .WithOne(pt => pt.Task);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Tasks)
                .WithOne(t => t.Student);
        }
    }
}
