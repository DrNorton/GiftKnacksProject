CREATE PROCEDURE [dbo].[UpdatePassword]
	@UserId bigint,
	@NewPass nvarchar(50)
AS
	UPDATE Users Set "password"=@NewPass  Where UserId=@UserId
RETURN 0
