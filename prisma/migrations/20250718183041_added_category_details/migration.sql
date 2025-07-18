/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Category` table. All the data in the column will be lost.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameArabic` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameFrench` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_categoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "categoryId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "nameArabic" TEXT NOT NULL,
ADD COLUMN     "nameFrench" TEXT NOT NULL,
ADD COLUMN     "parentCategoryId" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
