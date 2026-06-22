/*
  Warnings:

  - Added the required column `machineId` to the `Telemetry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Telemetry" ADD COLUMN     "machineId" TEXT NOT NULL;
