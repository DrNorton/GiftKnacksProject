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
PRINT N'Creating [dbo].[WishCategories]...';


GO
CREATE TABLE [dbo].[WishCategories] (
    [Id]          INT           IDENTITY (1, 1) NOT NULL,
    [Name]        NVARCHAR (50) NOT NULL,
    [Description] NCHAR (250)   NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[Wishes]...';


GO
CREATE TABLE [dbo].[Wishes] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [Name]        NVARCHAR (50)  NULL,
    [Country]     NVARCHAR (2)   NULL,
    [City]        NVARCHAR (150) NULL,
    [UserId]      BIGINT         NOT NULL,
    [FromDate]    DATETIME       NULL,
    [ToDate]      DATETIME       NULL,
    [Benefit]     NVARCHAR (150) NULL,
    [Description] NVARCHAR (150) NULL,
    [CategoryId]  INT            NOT NULL,
    [Location]    NVARCHAR (150) NULL,
    [ImageUrl]    NVARCHAR (150) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[FK_Wishes_Countries]...';


GO
ALTER TABLE [dbo].[Wishes] WITH NOCHECK
    ADD CONSTRAINT [FK_Wishes_Countries] FOREIGN KEY ([Country]) REFERENCES [dbo].[Countries] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Wishes_Users]...';


GO
ALTER TABLE [dbo].[Wishes] WITH NOCHECK
    ADD CONSTRAINT [FK_Wishes_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]);


GO
PRINT N'Creating [dbo].[FK_Wishes_Categories]...';


GO
ALTER TABLE [dbo].[Wishes] WITH NOCHECK
    ADD CONSTRAINT [FK_Wishes_Categories] FOREIGN KEY ([CategoryId]) REFERENCES [dbo].[WishCategories] ([Id]);


GO