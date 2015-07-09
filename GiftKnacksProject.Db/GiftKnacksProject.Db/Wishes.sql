CREATE TABLE [dbo].[Wishes]
(
	[Id] BIGINT NOT NULL PRIMARY KEY Identity(1,1), 
    [Name] NVARCHAR(50) NULL,
	[Country] NVARCHAR(2) NULL, 
	[City] NVARCHAR(150) NULL , 
	[UserId] BIGINT NOT NULL, 
    [FromDate] DATETIME NULL, 
    [ToDate] DATETIME NULL, 
    [Benefit] NVARCHAR(150) NULL, 
    [Description] NVARCHAR(150) NULL, 
    [CategoryId] INT NOT NULL, 
    [Location] NVARCHAR(150) NULL, 
    [ImageUrl] NVARCHAR(150) NULL, 
    [Emergency] INT NOT NULL , 
    CONSTRAINT [FK_Wishes_Countries] FOREIGN KEY ([Country]) REFERENCES [Countries]([Id]),
	CONSTRAINT [FK_Wishes_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),
	CONSTRAINT [FK_Wishes_Categories] FOREIGN KEY ([CategoryId]) REFERENCES [WishCategories]([Id]),
)
