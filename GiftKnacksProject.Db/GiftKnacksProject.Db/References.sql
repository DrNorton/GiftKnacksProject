CREATE TABLE [dbo].[References]
(
	[Id] BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [Text] NVARCHAR(250) NULL, 
    [Rate] tinyint NULL, 
    [ReplyerId] BIGINT NULL, 
    [OwnerId] BIGINT NULL,
	CONSTRAINT [FK_References_ReplyUserId] FOREIGN KEY ([ReplyerId]) REFERENCES [Users]([Id]),
	CONSTRAINT [FK_References_OwnerUserId] FOREIGN KEY ([OwnerId]) REFERENCES [Users]([Id])
		
)
