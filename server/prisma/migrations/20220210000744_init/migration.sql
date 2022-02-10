-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alt" TEXT,
    "format" TEXT,
    "size" INTEGER,
    "width" INTEGER,
    "height" INTEGER
);
INSERT INTO "new_Image" ("alt", "filename", "format", "height", "id", "size", "width") SELECT "alt", "filename", "format", "height", "id", "size", "width" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_filename_key" ON "Image"("filename");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
