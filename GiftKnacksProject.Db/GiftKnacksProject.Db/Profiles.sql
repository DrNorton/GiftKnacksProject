CREATE TABLE [dbo].[Profiles]
(
	[Id] BIGINT NOT NULL, 
    [FirstName] NVARCHAR(50) NULL, 
	[LastName] NVARCHAR(50) NULL, 
	[Country] NVARCHAR(50) NULL, 
	[City] NVARCHAR(50) NULL , 
    [AvatarUrl] NVARCHAR(50) NULL, 
    [AboutMe] NVARCHAR(250) NULL,
	[Birthday] datetime, 
    CONSTRAINT [PK_Profiles] PRIMARY KEY ([Id]), 
    CONSTRAINT [FK_Profiles_USERS] FOREIGN KEY ([Id]) REFERENCES [Users]([Id])

)

