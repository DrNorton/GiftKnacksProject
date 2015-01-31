CREATE TABLE [dbo].[Contacts]
(
	[Id] BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
	[Skype] NVARCHAR(10) NULL, 
	[Facebook] NVARCHAR(50) NULL, 
	[Vk] NVARCHAR(50) NULL, 
	[Telephone] NVARCHAR(12) NULL, 
    CONSTRAINT [FK_Contacts_Profiles] FOREIGN KEY ([Id]) REFERENCES [Profiles]([Id])
)
