/*
  Warnings:

  - Changed the type of `color` on the `Group` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `color` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `onlineStatus` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NoImageColors" AS ENUM ('orange', 'red', 'green', 'blue', 'yellow');

-- CreateEnum
CREATE TYPE "OnlineSatus" AS ENUM ('offline', 'online', 'idle', 'doNotDisturb');

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "color",
ADD COLUMN     "color" "NoImageColors" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "color",
ADD COLUMN     "color" "NoImageColors" NOT NULL,
DROP COLUMN "onlineStatus",
ADD COLUMN     "onlineStatus" "OnlineSatus" NOT NULL;

-- CreateTable
CREATE TABLE "_UserFriends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFriends_AB_unique" ON "_UserFriends"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFriends_B_index" ON "_UserFriends"("B");

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
