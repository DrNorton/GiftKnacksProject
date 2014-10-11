CREATE PROCEDURE [dbo].[GetUserById]
	@Id bigint
AS
	SELECT * from [dbo].[Users] Where UserId=@Id
RETURN 0
