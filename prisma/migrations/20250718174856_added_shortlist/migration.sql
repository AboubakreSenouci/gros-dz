/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPPLIER', 'BUYER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProductVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('PIECE', 'BOX');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'DELIVERED', 'CANCELED', 'DECLINED', 'RETURNED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CLOSED');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_supplierId_fkey";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "phoneNumber" TEXT,
    "phoneNumberVerified" BOOLEAN,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierProfile" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "businessCategory" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "SupplierProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BuyerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameArabic" TEXT,
    "description" TEXT,
    "images" TEXT[],
    "categoryId" TEXT NOT NULL,
    "subCategoryId" TEXT,
    "price" INTEGER NOT NULL,
    "quantityAvailable" INTEGER NOT NULL,
    "minOrderQuantity" INTEGER NOT NULL,
    "visibility" "ProductVisibility" NOT NULL DEFAULT 'PUBLIC',
    "isDeliveryAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isSampleAvailable" BOOLEAN NOT NULL DEFAULT false,
    "samplePrice" INTEGER,
    "orderType" "OrderType" NOT NULL,
    "numberOfPiecesPerBox" INTEGER,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "supplierId" TEXT NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_price_variant" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_price_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "shippingDeliveryPrice" INTEGER NOT NULL DEFAULT 0,
    "status" "OrderStatus" NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "InquiryStatus" NOT NULL,
    "buyerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shortlist" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shortlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "user"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierProfile_userId_key" ON "SupplierProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyerProfile_userId_key" ON "BuyerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "order_orderNumber_key" ON "order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- AddForeignKey
ALTER TABLE "SupplierProfile" ADD CONSTRAINT "SupplierProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerProfile" ADD CONSTRAINT "BuyerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "SupplierProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_price_variant" ADD CONSTRAINT "product_price_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "BuyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "SupplierProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "BuyerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shortlist" ADD CONSTRAINT "shortlist_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "BuyerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shortlist" ADD CONSTRAINT "shortlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
