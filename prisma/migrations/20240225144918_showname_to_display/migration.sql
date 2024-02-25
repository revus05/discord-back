/*
  Warnings:

  - You are about to drop the column `showname` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "showname",
ADD COLUMN     "displayname" TEXT NOT NULL DEFAULT 'user';
