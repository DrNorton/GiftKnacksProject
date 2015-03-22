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
PRINT N'Dropping [dbo].[FK_Gifts_Countries]...';


GO
ALTER TABLE [dbo].[Gifts] DROP CONSTRAINT [FK_Gifts_Countries];


GO
PRINT N'Dropping [dbo].[FK_Gifts_Users]...';


GO
ALTER TABLE [dbo].[Gifts] DROP CONSTRAINT [FK_Gifts_Users];


GO
PRINT N'Starting rebuilding table [dbo].[Gifts]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [dbo].[tmp_ms_xx_Gifts] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [Name]        NVARCHAR (50)  NULL,
    [Country]     NVARCHAR (2)   NULL,
    [UserId]      BIGINT         NOT NULL,
    [City]        NVARCHAR (150) NULL,
    [Location]    NVARCHAR (150) NULL,
    [FromDate]    DATETIME       NULL,
    [ToDate]      DATETIME       NULL,
    [Benefit]     NVARCHAR (150) NULL,
    [Description] NVARCHAR (150) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [dbo].[Gifts])
    BEGIN
        SET IDENTITY_INSERT [dbo].[tmp_ms_xx_Gifts] ON;
        INSERT INTO [dbo].[tmp_ms_xx_Gifts] ([Id], [Name], [Country], [UserId], [City], [Location], [FromDate], [ToDate], [Benefit], [Description])
        SELECT   [Id],
                 [Name],
                 [Country],
                 [UserId],
                 [City],
                 [Location],
                 [FromDate],
                 [ToDate],
                 [Benefit],
                 [Description]
        FROM     [dbo].[Gifts]
        ORDER BY [Id] ASC;
        SET IDENTITY_INSERT [dbo].[tmp_ms_xx_Gifts] OFF;
    END

DROP TABLE [dbo].[Gifts];

EXECUTE sp_rename N'[dbo].[tmp_ms_xx_Gifts]', N'Gifts';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Creating [dbo].[FK_Gifts_Countries]...';


GO
ALTER TABLE [dbo].[Gifts] WITH NOCHECK
    ADD CONSTRAINT [FK_Gifts_Countries] FOREIGN KEY ([Country]) REFERENCES [dbo].[Countries] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Gifts_Users]...';


GO
ALTER TABLE [dbo].[Gifts] WITH NOCHECK
    ADD CONSTRAINT [FK_Gifts_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]);


GO