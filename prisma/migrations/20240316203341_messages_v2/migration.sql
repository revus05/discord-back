-- AlterTable
ALTER TABLE "FriendRequest" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "timestamp" SET DEFAULT NOW(),
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT NOW();
