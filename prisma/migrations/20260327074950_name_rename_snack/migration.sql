/*
  Warnings:

  - The values [snacks] on the enum `BoxSet` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BoxSet_new" AS ENUM ('snack', 'produce', 'bath', 'kitchen', 'premium', 'healing', 'outdoor', 'ultimate');
ALTER TABLE "Configuration" ALTER COLUMN "boxSet" TYPE "BoxSet_new" USING ("boxSet"::text::"BoxSet_new");
ALTER TYPE "BoxSet" RENAME TO "BoxSet_old";
ALTER TYPE "BoxSet_new" RENAME TO "BoxSet";
DROP TYPE "BoxSet_old";
COMMIT;
