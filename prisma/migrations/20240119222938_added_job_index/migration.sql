/*
  Warnings:

  - A unique constraint covering the columns `[jobNumber]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "JobIndex" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "index" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "JobIndex_index_key" ON "JobIndex"("index");

-- CreateIndex
CREATE UNIQUE INDEX "Job_jobNumber_key" ON "Job"("jobNumber");
