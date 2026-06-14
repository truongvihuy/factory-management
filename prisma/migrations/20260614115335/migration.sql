/*
  Warnings:

  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `Machine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `RoleUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Sensor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status_Machine" AS ENUM ('RUNNING', 'IDLE', 'READY', 'DOWN', 'ERROR', 'MAINTENANCE', 'REPAIR', 'MATERIAL_SHORTAGE', 'SETUP');

-- CreateEnum
CREATE TYPE "Status_Sensor" AS ENUM ('ACTIVE', 'INACTIVE', 'CONNECTED', 'DISCONNECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MANAGER', 'ENGINEER', 'OPERATOR', 'VIEW');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGHT', 'CRITICAL');

-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "status",
ADD COLUMN     "status" "Status_Machine" NOT NULL;

-- AlterTable
ALTER TABLE "RoleUser" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "status",
ADD COLUMN     "status" "Status_Sensor" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
