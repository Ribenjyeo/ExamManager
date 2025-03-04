﻿using ExamManager.Models;
using System.Security.Claims;

namespace ExamManager.Services;

public interface IUserService
{
    public Task<User?> GetUser(Guid userId, bool includeGroup = false, bool includeTasks = false, bool includePersonalTasks = false);
    public Task<User?> GetUser(string login, string password, bool includeGroup = false, bool includeTasks = false);
    public ClaimsPrincipal? CreateUserPrincipal(User user);
    public Task<IEnumerable<User>> GetUsers(UserOptions options, bool includeGroup = false, bool includePersonalTasks = false, bool includeTasks = false);
    public Task<IEnumerable<User>> GetUsers(IEnumerable<Guid> userIds, bool includeGroup = false, bool includeTasks = false);

    /// <summary>
    /// Меняет значения свойств пользователя по его ObjectID
    /// </summary>
    /// <param name="userId">ObjectID пользователя</param>
    /// <param name="data">Массив свойств, которые необходимо изменить</param>
    /// <returns></returns>
    public Task<ValidationResult> ChangeUserData(Guid userId, params Property[] data);

    public Task<User> RegisterUser(User user);
    public Task RegisterUsers(IEnumerable<User> users);
    public Task DeleteUser(Guid userId);
    public Task DeleteUsers(HashSet<Guid> userIds);
    public Task<ValidationResult> ValidateUser(User user);
    public Task<IEnumerable<PersonalTask>> AddUserTasks(Guid userId, Guid[] taskIds);
    public Task RemoveUserTasks(Guid[] personalTaskIds);
}

public struct UserOptions
{
    public string? Name { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool? ExcludeYourself { get; set; }
    public bool? WithoutGroups { get; set; }
    public Guid[]? GroupIds { get; set; }
    public Guid[]? ExcludeGroupIds { get; set; }
    public Guid[]? TaskIds { get; set; }
    public Guid[]? ExcludeTaskIds { get; set; }
    public Models.TaskStatus? TaskStatus { get; set; }
    public UserRole? Role { get; set; }

    public Guid? CurrentUserID { get; set; }
}