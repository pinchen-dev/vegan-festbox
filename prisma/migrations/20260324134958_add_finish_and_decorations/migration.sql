/*
  Warnings:

  - You are about to drop the column `material` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Configuration` table. All the data in the column will be lost.
  - The `color` column on the `Configuration` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `finish` column on the `Configuration` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Occasion" AS ENUM ('daily', 'cny', 'valentine', 'dragonboat', 'moonfest', 'christmas');

-- CreateEnum
CREATE TYPE "BoxSet" AS ENUM ('snacks', 'produce', 'bath', 'kitchen', 'premium', 'healing', 'outdoor', 'ultimate');

-- CreateEnum
CREATE TYPE "BoxColor" AS ENUM ('festive_red', 'sakura_pink', 'sage_green', 'moon_gold', 'oat', 'linen');

-- CreateEnum
CREATE TYPE "BoxFinish" AS ENUM ('standard', 'recycled', 'linen');

-- CreateEnum
CREATE TYPE "Decoration" AS ENUM ('twine', 'wax_seal', 'botanical');

-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "material",
DROP COLUMN "model",
ADD COLUMN     "boxSet" "BoxSet",
ADD COLUMN     "decorations" "Decoration"[],
ADD COLUMN     "occasion" "Occasion",
ALTER COLUMN "width" DROP NOT NULL,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL,
DROP COLUMN "color",
ADD COLUMN     "color" "BoxColor",
DROP COLUMN "finish",
ADD COLUMN     "finish" "BoxFinish" NOT NULL DEFAULT 'standard';

-- DropEnum
DROP TYPE "CaseColor";

-- DropEnum
DROP TYPE "CaseFinish";

-- DropEnum
DROP TYPE "CaseMaterial";

-- DropEnum
DROP TYPE "PhoneModel";
