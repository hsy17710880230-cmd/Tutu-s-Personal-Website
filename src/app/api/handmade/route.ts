import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase"; // adjust path if needed

export async function GET() {
  const folder = "handmade";

  try {
    const { data, error } = await supabase.storage
      .from("arts")
      .list(folder, { limit: 1000 });

    if (error || !data) {
      throw error;
    }

    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/arts`;

    const projects = data
      .filter((item) => item.id === null) // folders only
      .map((folder) => ({
        title: folder.name,
        img_path: `${baseUrl}/handmade/${folder.name}/title.png`,
      }));

    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read projects" },
      { status: 500 }
    );
  }
}
