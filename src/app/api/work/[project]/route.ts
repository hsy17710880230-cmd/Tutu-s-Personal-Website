import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase"; // adjust path if needed

export async function GET(
  req: Request,
  { params }: { params: Promise<{ project: string }> }
) {
  const p = await params;
  const project = p.project;
  const folder = `work/${project}`;

  try {
    const { data, error } = await supabase.storage
      .from("arts")
      .list(folder, { limit: 1000 });

    if (error || !data) {
      throw error;
    }

    const images = data
      .filter((f) => f.name.endsWith(".png"))
      .filter((f) => f.name !== "title.png")
      .sort((a, b) => {
        const na = parseInt(a.name);
        const nb = parseInt(b.name);
        return na - nb;
      })
      .map((file) => {
        const { data: url } = supabase.storage
          .from("arts")
          .getPublicUrl(`${folder}/${file.name}`);

        return url.publicUrl;
      });

    // Load description.txt if it exists
    let description = "";
    const descFile = data.find((f) => f.name === "description.txt");

    if (descFile) {
      const { data: fileData, error: downloadError } =
        await supabase.storage
          .from("arts")
          .download(`${folder}/description.txt`);

      if (!downloadError && fileData) {
        description = await fileData.text();
      }
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
