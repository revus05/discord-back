/*
  Warnings:

  - You are about to drop the column `displayname` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "displayname",
ADD COLUMN     "displayName" TEXT NOT NULL DEFAULT 'user';
