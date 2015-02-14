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
/*
The column [dbo].[Profiles].[MainContactId] is being dropped, data loss could occur.
*/

IF EXISTS (select top 1 1 from [dbo].[Profiles])
    RAISERROR (N'Rows were detected. The schema update is terminating because data loss might occur.', 16, 127) WITH NOWAIT

GO
PRINT N'Dropping [dbo].[FK_Profiles_Contacts]...';


GO
ALTER TABLE [dbo].[Profiles] DROP CONSTRAINT [FK_Profiles_Contacts];


GO
PRINT N'Altering [dbo].[Profiles]...';


GO
ALTER TABLE [dbo].[Profiles] DROP COLUMN [MainContactId];


GO
/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/
INSERT INTO ContactTypes (Name) Values('Email')
INSERT INTO ContactTypes (Name) Values('Skype')
INSERT INTO ContactTypes (Name) Values('VK')
INSERT INTO ContactTypes (Name) Values('Facebook')

GO

GO
PRINT N'Update complete.';


GO
