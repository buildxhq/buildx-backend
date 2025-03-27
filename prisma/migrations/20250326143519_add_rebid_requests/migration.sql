-- CreateTable
CREATE TABLE "rebid_requests" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "requested_by" INTEGER NOT NULL,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'open',

    CONSTRAINT "rebid_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rebid_requests" ADD CONSTRAINT "rebid_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rebid_requests" ADD CONSTRAINT "rebid_requests_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
