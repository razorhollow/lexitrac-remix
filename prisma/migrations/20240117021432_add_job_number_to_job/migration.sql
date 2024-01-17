-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobNumber" INTEGER NOT NULL DEFAULT 0,
    "caseName" TEXT NOT NULL,
    "jobDate" DATETIME NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "client" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reporterId" TEXT,
    CONSTRAINT "Job_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("caseName", "client", "createdAt", "dueDate", "id", "jobDate", "reporterId", "updatedAt") SELECT "caseName", "client", "createdAt", "dueDate", "id", "jobDate", "reporterId", "updatedAt" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_jobNumber_key" ON "Job"("jobNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
