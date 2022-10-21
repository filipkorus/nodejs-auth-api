/*
  Warnings:

  - You are about to drop the column `created_at` on the `ActivationToken` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ActivationToken` table. All the data in the column will be lost.
  - You are about to drop the column `account_activated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `joined_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `ActivationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ActivationToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ActivationToken` DROP FOREIGN KEY `ActivationToken_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Movie` DROP FOREIGN KEY `Movie_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Token` DROP FOREIGN KEY `Token_user_id_fkey`;

-- AlterTable
ALTER TABLE `ActivationToken` DROP COLUMN `created_at`,
    DROP COLUMN `user_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `account_activated`,
    DROP COLUMN `joined_at`,
    ADD COLUMN `accountActivated` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `banned` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `Movie`;

-- DropTable
DROP TABLE `Token`;

-- CreateTable
CREATE TABLE `AuthToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(150) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `AuthToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ActivationToken_userId_key` ON `ActivationToken`(`userId`);

-- AddForeignKey
ALTER TABLE `AuthToken` ADD CONSTRAINT `AuthToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivationToken` ADD CONSTRAINT `ActivationToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
