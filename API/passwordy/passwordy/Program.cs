using System;
using System.Security.Cryptography;
using System.Text;

namespace PasswordEncryptor
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("create a password:");
            string password = Console.ReadLine();

            // Hash the password
            byte[] passwordHash = HashPassword(password);

            // Convert the hash to a string
            string passwordHashString = Convert.ToBase64String(passwordHash);

            Console.WriteLine("Enter password:");
            string enteredPassword = Console.ReadLine();

            // Hash the entered password
            byte[] enteredPasswordHash = HashPassword(enteredPassword);

            // Convert the hash to a string
            string enteredPasswordHashString = Convert.ToBase64String(enteredPasswordHash);

            // Compare the entered password hash to the stored password hash
            if (enteredPasswordHashString == passwordHashString)
            {
                Console.WriteLine("The password is correct.");
            }
            else
            {
                Console.WriteLine("The password is incorrect.");
            }
        }

        static byte[] HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                return sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
