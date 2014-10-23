CREATE PROCEDURE [dbo].[GetWishByWisherId]
	@wisherid bigint
AS
	SELECT * from [dbo].[Wishes] Where WisherId=@wisherid
RETURN 0
