CREATE TABLE [dbo].[WishParticipants]
(
	[Id] INT NOT NULL PRIMARY KEY Identity(1,1), 
	[UserId] BIGINT NOT NULL, 
	[WishId] BIGINT NOT NULL, 
	[CreatedTime] DATETIME NULL, 
	CONSTRAINT [FK_WishParticipants_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),
	CONSTRAINT [FK_WishParticipants_Wishes] FOREIGN KEY ([WishId]) REFERENCES [Wishes]([Id])
)
