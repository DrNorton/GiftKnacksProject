﻿CREATE TABLE [dbo].[Users]
(
	[UserId] BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [Email] NVARCHAR(50) NOT NULL, 
    [Password] NVARCHAR(50) NOT NULL
)