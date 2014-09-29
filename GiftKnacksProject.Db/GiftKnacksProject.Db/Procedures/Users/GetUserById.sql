CREATE PROCEDURE [dbo].[GetUserById]
	@id bigint
AS
	SELECT * from [dbo].[Users] Where UserId=@id
RETURN 0
