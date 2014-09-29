CREATE PROCEDURE [dbo].[Register]
	@Email nvarchar(50),
	@Password nvarchar(50),
	@new_identity bigint = NULL OUTPUT
AS
Insert into [dbo].[Users] Values(@Email,@Password);
 SET @new_identity = SCOPE_IDENTITY();
RETURN @new_identity;

