-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENDED', 'REVIEWING', 'SOLVED');

-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('RESET_PASSWORD', 'AUTHENTICATE');

-- CreateTable
CREATE TABLE "users" (
    "uuid" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT '0001-01-01 00:00:00 +00:00',
    "configurations" JSONB NOT NULL DEFAULT '{"name_public": false, "email_public": false}',
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "posts" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "content" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT '0001-01-01 00:00:00 +00:00',
    "likes_number" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "comments" (
    "uuid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT '0001-01-01 00:00:00 +00:00',
    "likes_number" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "reports" (
    "uuid" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT,
    "comment_id" TEXT,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "MessageStatus" NOT NULL DEFAULT 'SENDED',

    CONSTRAINT "reports_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tokens" (
    "uuid" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity" "Activity" NOT NULL DEFAULT 'AUTHENTICATE',
    "sub" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_post" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_comment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_sub_key" ON "tokens"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_user_id_activity_key" ON "tokens"("user_id", "activity");

-- CreateIndex
CREATE UNIQUE INDEX "_post_AB_unique" ON "_post"("A", "B");

-- CreateIndex
CREATE INDEX "_post_B_index" ON "_post"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_comment_AB_unique" ON "_comment"("A", "B");

-- CreateIndex
CREATE INDEX "_comment_B_index" ON "_comment"("B");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_post" ADD CONSTRAINT "_post_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_post" ADD CONSTRAINT "_post_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_comment" ADD CONSTRAINT "_comment_A_fkey" FOREIGN KEY ("A") REFERENCES "comments"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_comment" ADD CONSTRAINT "_comment_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
