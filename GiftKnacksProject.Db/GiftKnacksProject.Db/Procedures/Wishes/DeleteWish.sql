CREATE PROCEDURE [dbo].[DeleteWish]
	@wishid bigint
AS
	DELETE FROM [dbo].Wishes WHERE WishId=@wishid
RETURN 0
