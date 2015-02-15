CREATE TABLE [dbo].[Wishes]
(
	[Id] INT NOT NULL PRIMARY KEY Identity(1,1), 
    [Name] NVARCHAR(50) NULL,
	[Country] NVARCHAR(2) NULL, 
	[City] NVARCHAR(150) NULL , 
	[UserId] BIGINT NOT NULL, 
    CONSTRAINT [FK_Wishes_Countries] FOREIGN KEY ([Country]) REFERENCES [Countries]([Id]),
	CONSTRAINT [FK_Wishes_Users] FOREIGN KEY ([UserId]) REFERENCES [Countries]([Id]),
)
