CREATE PROCEDURE [dbo].[GetWishById]
	@wishid bigint
AS
	SELECT * from [dbo].[Wishes] Where WishId=@wishid
RETURN 0
