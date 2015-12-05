namespace GiftKnacksProject.Api.Services.Interfaces
{
    public interface IUserOnlineStorage
    {
        void AddUserToOnline(long userId, string connectionId);
        void RemoveUserFromOnline(long userId, string connectionId);
        bool GetOnlineStatus(long id);
    }
}