/*
  Warnings:

  - You are about to alter the column `token` on the `ActivationToken` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(60)`.
  - You are about to alter the column `filename` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(60)`.
  - You are about to alter the column `token` on the `Token` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(80)`.
  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE `ActivationToken` MODIFY `token` VARCHAR(60) NOT NULL;

-- AlterTable
ALTER TABLE `Movie` MODIFY `filename` VARCHAR(60) NOT NULL;

-- AlterTable
ALTER TABLE `Token` MODIFY `token` VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `username` VARCHAR(30) NOT NULL,
    MODIFY `password` VARCHAR(80) NOT NULL,
    MODIFY `role` VARCHAR(20) NOT NULL;
