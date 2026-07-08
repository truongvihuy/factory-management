-- CreateTable
CREATE TABLE "MachineStatus" (
    "machineCode" TEXT NOT NULL,
    "status" "Status_Machine" NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachineStatus_pkey" PRIMARY KEY ("machineCode")
);

-- CreateTable
CREATE TABLE "DeviceHeartBear" (
    "deviceCode" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceHeartBear_pkey" PRIMARY KEY ("deviceCode")
);

-- CreateIndex
CREATE INDEX "SensorReading_sensorCode_idx" ON "SensorReading"("sensorCode");
