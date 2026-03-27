/*
  Warnings:

  - You are about to drop the column `decorations` on the `Configuration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "decorations",
ADD COLUMN     "decoration" TEXT[];
