/*
  Warnings:

  - Added the required column `secretKey` to the `DeviceHeartBear` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeviceHeartBear" ADD COLUMN     "secretKey" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MachineMetadata" (
    "machineCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status_Machine" NOT NULL,

    CONSTRAINT "MachineMetadata_pkey" PRIMARY KEY ("machineCode")
);

-- CreateTable
CREATE TABLE "SensorMetadata" (
    "sensorCode" TEXT NOT NULL,
    "machineCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "status" "Status_Sensor" NOT NULL,

    CONSTRAINT "SensorMetadata_pkey" PRIMARY KEY ("sensorCode")
);

-- CreateTable
CREATE TABLE "DeviceMetadata" (
    "deviceCode" TEXT NOT NULL,
    "machineCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "status" "Status_Device" NOT NULL,

    CONSTRAINT "DeviceMetadata_pkey" PRIMARY KEY ("deviceCode")
);

-- AddForeignKey
ALTER TABLE "SensorMetadata" ADD CONSTRAINT "SensorMetadata_machineCode_fkey" FOREIGN KEY ("machineCode") REFERENCES "MachineMetadata"("machineCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceMetadata" ADD CONSTRAINT "DeviceMetadata_machineCode_fkey" FOREIGN KEY ("machineCode") REFERENCES "MachineMetadata"("machineCode") ON DELETE RESTRICT ON UPDATE CASCADE;
