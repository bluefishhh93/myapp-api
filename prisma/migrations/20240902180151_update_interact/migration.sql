/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId,type]` on the table `Interaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Interaction_userId_postId_type_key" ON "Interaction"("userId", "postId", "type");
