-- Add isPublished to User model
-- Existing onboarded users are automatically published so their profiles stay visible
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN NOT NULL DEFAULT false;
UPDATE "User" SET "isPublished" = true WHERE "onboarded" = true;
