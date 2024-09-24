-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Customer', 'Admin');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "Role" "UserRole" NOT NULL DEFAULT 'Customer';
