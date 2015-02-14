﻿/*
Deployment script for GiftKnacks_db

This code was generated by a tool.
Changes to this file may cause incorrect behavior and will be lost if
the code is regenerated.
*/

GO
SET ANSI_NULLS, ANSI_PADDING, ANSI_WARNINGS, ARITHABORT, CONCAT_NULL_YIELDS_NULL, QUOTED_IDENTIFIER ON;

SET NUMERIC_ROUNDABORT OFF;


GO
:setvar DatabaseName "GiftKnacks_db"
:setvar DefaultFilePrefix "GiftKnacks_db"
:setvar DefaultDataPath ""
:setvar DefaultLogPath ""

GO
:on error exit
GO
/*
Detect SQLCMD mode and disable script execution if SQLCMD mode is not supported.
To re-enable the script after enabling SQLCMD mode, execute the following:
SET NOEXEC OFF; 
*/
:setvar __IsSqlCmdEnabled "True"
GO
IF N'$(__IsSqlCmdEnabled)' NOT LIKE N'True'
    BEGIN
        PRINT N'SQLCMD mode must be enabled to successfully execute this script.';
        SET NOEXEC ON;
    END


GO
USE [$(DatabaseName)];


GO
PRINT N'Dropping unnamed constraint on [dbo].[Profiles]...';


GO
ALTER TABLE [dbo].[Profiles] DROP CONSTRAINT [DF__Profiles__IsFill__3E52440B];


GO
PRINT N'Dropping [dbo].[FK_Profiles_USERS]...';


GO
ALTER TABLE [dbo].[Profiles] DROP CONSTRAINT [FK_Profiles_USERS];


GO
PRINT N'Dropping [dbo].[FK_Contacts_Profiles]...';


GO
ALTER TABLE [dbo].[Contacts] DROP CONSTRAINT [FK_Contacts_Profiles];


GO
PRINT N'Starting rebuilding table [dbo].[Profiles]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [dbo].[tmp_ms_xx_Profiles] (
    [Id]           BIGINT         NOT NULL,
    [FirstName]    NVARCHAR (50)  NULL,
    [LastName]     NVARCHAR (50)  NULL,
    [Country]      NVARCHAR (50)  NULL,
    [City]         NVARCHAR (50)  NULL,
    [AvatarUrl]    NVARCHAR (50)  NULL,
    [AboutMe]      NVARCHAR (250) NULL,
    [Birthday]     DATETIME       NULL,
    [HideBirthday] BIT            DEFAULT 0 NOT NULL,
    [IsFilled]     BIT            DEFAULT 0 NOT NULL,
    CONSTRAINT [tmp_ms_xx_constraint_PK_Profiles] PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [dbo].[Profiles])
    BEGIN
        INSERT INTO [dbo].[tmp_ms_xx_Profiles] ([Id], [FirstName], [LastName], [Country], [City], [AvatarUrl], [AboutMe], [Birthday], [IsFilled])
        SELECT   [Id],
                 [FirstName],
                 [LastName],
                 [Country],
                 [City],
                 [AvatarUrl],
                 [AboutMe],
                 [Birthday],
                 [IsFilled]
        FROM     [dbo].[Profiles]
        ORDER BY [Id] ASC;
    END

DROP TABLE [dbo].[Profiles];

EXECUTE sp_rename N'[dbo].[tmp_ms_xx_Profiles]', N'Profiles';

EXECUTE sp_rename N'[dbo].[tmp_ms_xx_constraint_PK_Profiles]', N'PK_Profiles', N'OBJECT';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Creating [dbo].[FK_Profiles_USERS]...';


GO
ALTER TABLE [dbo].[Profiles] WITH NOCHECK
    ADD CONSTRAINT [FK_Profiles_USERS] FOREIGN KEY ([Id]) REFERENCES [dbo].[Users] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Contacts_Profiles]...';


GO
ALTER TABLE [dbo].[Contacts] WITH NOCHECK
    ADD CONSTRAINT [FK_Contacts_Profiles] FOREIGN KEY ([Id]) REFERENCES [dbo].[Profiles] ([Id]);


GO
