import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const baseFolder = path.join(process.cwd(), "public/assets/illustration");

  try {
    const folders = fs
      .readdirSync(baseFolder, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const folderData = folders.map((folder) => {
      const folderPath = path.join(baseFolder, folder);

      const images = fs
        .readdirSync(folderPath)
        .filter((file) =>
          /\.(png)$/i.test(file)
        )
        .map((file) => `/assets/illustration/${folder}/${file}`);

      return {
        folder,
        images,
      };
    });

    // optional sorting (works for years OR names)
    folderData.sort((a, b) => b.folder.localeCompare(a.folder));

    return NextResponse.json(folderData);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read folders" },
      { status: 500 }
    );
  }
}
