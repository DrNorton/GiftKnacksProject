﻿CREATE TABLE [dbo].[Users]
(
	[Id] BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [Email] NVARCHAR(50) NOT NULL, 
    [Password] NVARCHAR(300) NOT NULL, 
    [DateRegister] DATETIME NOT NULL, 
    [ConfirmMail] BIT NULL DEFAULT 0
)
