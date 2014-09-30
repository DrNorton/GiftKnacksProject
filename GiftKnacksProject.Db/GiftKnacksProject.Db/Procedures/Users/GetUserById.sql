CREATE PROCEDURE [dbo].[GetUserById]
	@id bigint
AS
	SELECT UserId,Email from [dbo].[Users] Where UserId=@id
RETURN 0
