/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Bookmark` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Interaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "createdAt";
