/*
  Warnings:

  - Added the required column `iv_private_key` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `private_key` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "iv_private_key" TEXT NOT NULL,
ADD COLUMN     "private_key" TEXT NOT NULL;
