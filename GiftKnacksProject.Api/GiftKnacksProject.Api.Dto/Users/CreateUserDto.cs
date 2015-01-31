namespace GiftKnacksProject.Api.Dto.Users
{
    public class CreateUserDto
    {

        private readonly string _email;
        private readonly string _password;

        public CreateUserDto(string email, string password)
        {
            _email = email;
            _password = password;
        }

      

        public string Email
        {
            get { return _email; }
        }

        public string Password
        {
            get { return _password; }
        }
    }
}
