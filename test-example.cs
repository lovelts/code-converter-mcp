using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace ExampleProject
{
    public class User
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public List<string> Hobbies { get; set; }

        public User(string name, int age)
        {
            Name = name;
            Age = age;
            Hobbies = new List<string>();
        }

        public void AddHobby(string hobby)
        {
            Hobbies.Add(hobby);
        }

        public bool HasHobby(string hobby)
        {
            return Hobbies.Contains(hobby);
        }

        public async Task<string> GetUserInfoAsync()
        {
            await Task.Delay(100);
            return $"User: {Name}, Age: {Age}";
        }
    }

    public interface IUserService
    {
        Task<User> GetUserByIdAsync(int id);
        Task<List<User>> GetAllUsersAsync();
    }

    public class UserService : IUserService
    {
        private readonly Dictionary<int, User> _users;

        public UserService()
        {
            _users = new Dictionary<int, User>();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            await Task.Delay(50);
            return _users.TryGetValue(id, out var user) ? user : null;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            await Task.Delay(100);
            return _users.Values.ToList();
        }
    }
} 