import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const workFolder = path.join(process.cwd(), "public/assets/handmade");

  try {
    const files = fs.readdirSync(workFolder);

    const projects = files.map((folder) => ({
      title: folder,
      img_path: `/assets/handmade/${folder}/title.png`,
    }));

    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json({ error: "Failed to read projects" }, { status: 500 });
  }
}
