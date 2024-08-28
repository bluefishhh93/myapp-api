-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'INACTIVE';
