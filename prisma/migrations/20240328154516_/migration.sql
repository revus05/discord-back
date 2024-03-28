/*
  Warnings:

  - You are about to drop the `UserChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserChat" DROP CONSTRAINT "UserChat_chatId_fkey";

-- DropForeignKey
ALTER TABLE "UserChat" DROP CONSTRAINT "UserChat_userId_fkey";

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "FriendRequest" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chatId" INTEGER,
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- DropTable
DROP TABLE "UserChat";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
