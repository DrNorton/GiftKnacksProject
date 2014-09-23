CREATE TABLE [dbo].[Profiles]
(
	[ProfileId] BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [FirstName] VARCHAR(50) NULL, 
    [LastName] VARCHAR(50) NULL, 
    [Country] VARCHAR(50) NULL, 
    [AvatarUrl] VARCHAR(150) NULL, 
    CONSTRAINT [FK_Profiles_ToUsers] FOREIGN KEY ([ProfileId]) REFERENCES [Users]([UserId])
)
