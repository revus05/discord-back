-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Minecraft is awesome',
ALTER COLUMN "color" DROP DEFAULT;
