namespace GiftKnacksProject.Api.Services.Interfaces
{
    public interface IUserOnlineStorage
    {
        void AddUserToOnline(long id);
        void RemoveUserFromOnline(long id);
        bool GetOnlineStatus(long id);
    }
}