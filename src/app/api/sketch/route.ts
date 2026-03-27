import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const workFolder = path.join(process.cwd(), "public/assets/sketch");

  try {
    const files = fs.readdirSync(workFolder);

    const projects = files.map((f) => ({
      title: f,
      img_path: `/assets/sketch/${f}`,
    }));

    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json({ error: "Failed to read projects" }, { status: 500 });
  }
}
