/*
  Warnings:

  - You are about to drop the column `images` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "images",
ADD COLUMN     "image" TEXT;
