import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase"; // adjust if needed

export async function GET() {
  const folder = "sketch";

  try {
    const { data, error } = await supabase.storage
      .from("arts")
      .list(folder, { limit: 1000 });

    if (error || !data) {
      throw error;
    }

    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/arts`;

    const projects = data
      .filter((file) => file.name) // ensures it's a file entry
      .map((file) => ({
        title: file.name,
        img_path: `${baseUrl}/${folder}/${file.name}`,
      }));

    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read projects" },
      { status: 500 }
    );
  }
}
