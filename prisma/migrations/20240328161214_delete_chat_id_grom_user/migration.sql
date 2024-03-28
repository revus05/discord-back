/*
  Warnings:

  - You are about to drop the column `chatId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "FriendRequest" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "User" DROP COLUMN "chatId",
ALTER COLUMN "createdAt" SET DEFAULT NOW();
