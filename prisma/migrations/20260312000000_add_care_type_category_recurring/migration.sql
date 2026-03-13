-- AlterTable: make dateNeeded nullable and add new care fields
ALTER TABLE "ChildcareRequest" ALTER COLUMN "dateNeeded" DROP NOT NULL;
ALTER TABLE "ChildcareRequest" ADD COLUMN "careType" TEXT NOT NULL DEFAULT 'occasional';
ALTER TABLE "ChildcareRequest" ADD COLUMN "recurringDays" TEXT;
ALTER TABLE "ChildcareRequest" ADD COLUMN "careCategory" TEXT;
