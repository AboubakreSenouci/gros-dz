/*
  Warnings:

  - A unique constraint covering the columns `[companyId,productId]` on the table `shortlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "shortlist_companyId_productId_key" ON "shortlist"("companyId", "productId");
