import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ project: string }> }
) {
  const p = await params;
  const project = p.project;

  try {
    const { data, error } = await supabase.storage
      .from("arts")
      .list(`handmade/${project}`, {
        limit: 1000,
        sortBy: { column: "name", order: "asc" },
      });

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
        const { data: publicUrl } = supabase.storage
          .from("arts")
          .getPublicUrl(`handmade/${project}/${file.name}`);

        return publicUrl.publicUrl;
      });

    return NextResponse.json({
      images,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }
}
