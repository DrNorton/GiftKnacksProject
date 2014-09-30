CREATE PROCEDURE [dbo].[GetUserByEmail]
	@Email nvarchar(50)
AS
	SELECT UserId,Email from [dbo].[Users] Where Email=@Email 
RETURN 0
