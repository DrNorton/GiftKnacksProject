CREATE PROCEDURE [dbo].[AddWish]
	@wishname nvarchar(50),
	@wisherid bigint,
	@description nvarchar(300),
	@new_identity bigint = NULL OUTPUT
AS
	Insert into [dbo].[Wishes] Values(@wishname,@wisherid,@description,GETDATE());
	SET @new_identity = SCOPE_IDENTITY();
RETURN @new_identity;
