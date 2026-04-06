/*
  Warnings:

  - You are about to drop the column `billingAddressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `street1` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `street2` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the `BillingAddress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.
  - Made the column `phoneNumber` on table `ShippingAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_billingAddressId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "billingAddressId",
ADD COLUMN     "companyTitle" TEXT,
ADD COLUMN     "invoiceType" TEXT NOT NULL DEFAULT 'ELECTRONIC',
ADD COLUMN     "invoiceValue" TEXT;

-- AlterTable
ALTER TABLE "ShippingAddress" DROP COLUMN "country",
DROP COLUMN "state",
DROP COLUMN "street1",
DROP COLUMN "street2",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;

-- DropTable
DROP TABLE "BillingAddress";
