-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" BIGINT NOT NULL,
    "userName" TEXT NOT NULL,
    "showName" TEXT NOT NULL,
    "birthdayDay" INTEGER NOT NULL,
    "birthdayMonth" TEXT NOT NULL,
    "birthdayYear" INTEGER NOT NULL,
    "userImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
