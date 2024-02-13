-- CreateTable
CREATE TABLE "OneTimePass" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OneTimePass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OneTimePass" ADD CONSTRAINT "OneTimePass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
