/*
  Warnings:

  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "onlineStatus" TEXT NOT NULL DEFAULT 'online',
ADD COLUMN     "textStatus" TEXT NOT NULL DEFAULT 'Minecraft awesome';
