CREATE PROCEDURE [dbo].[GetUserByEmail]
	@Email nvarchar(50)
AS
	SELECT * from [dbo].[Users] Where Email=@Email 
RETURN 0
