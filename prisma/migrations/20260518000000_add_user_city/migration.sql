-- AddColumn city to User (parents need a city stored directly on the user model)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "city" TEXT NOT NULL DEFAULT '';
