-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folder" (
    "id" SERIAL NOT NULL,
    "folderName" VARCHAR(255) NOT NULL,
    "userId" INTEGER NOT NULL,
    "path" TEXT NOT NULL DEFAULT 'root',
    "createdAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "randomName" VARCHAR(255),
    "url" VARCHAR(255) NOT NULL,
    "format" VARCHAR(255),
    "size" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL,
    "folderId" INTEGER NOT NULL,
    "publicId" VARCHAR(255),
    "updatedAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_sid_key" ON "session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "folder_id_key" ON "folder"("id");

-- CreateIndex
CREATE UNIQUE INDEX "file_id_key" ON "file"("id");

-- CreateIndex
CREATE UNIQUE INDEX "file_url_key" ON "file"("url");

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
