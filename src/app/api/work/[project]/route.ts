import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ project: string }> }
) {
  const p = await params
  const project = p.project;
  const folder = path.join(process.cwd(), "public/assets/work", project);

  try {
    const files = fs.readdirSync(folder);

    const images = files
      .filter((f) => f.endsWith(".png"))
      .filter((f) => f != "title.png")
      .sort((a, b) => {
        const na = parseInt(a);
        const nb = parseInt(b);
        return na - nb;
      })
      .map((file) => `/assets/work/${project}/${file}`);

    let description = "";
    const descPath = path.join(folder, "description.txt");

    if (fs.existsSync(descPath)) {
      description = fs.readFileSync(descPath, "utf-8");
    }

    return NextResponse.json({
      description,
      images,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }
}
