CREATE TABLE [dbo].[Wishes]
(
	[WishId] BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [WishName] NVARCHAR(50) NOT NULL, 
    [WisherId] BIGINT NOT NULL, 
    [Description] NVARCHAR(300) NULL, 
    [CreatedTime] DATETIME NULL, 
    CONSTRAINT [FK_Wishes_ToTable] FOREIGN KEY ([WisherId]) REFERENCES [Users]([UserId])

)
