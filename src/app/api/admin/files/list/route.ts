import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { requireAdmin, FileItem } from "@/src/lib/admin";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    await requireAdmin(token);

    const url = new URL(req.url);
    const path = url.searchParams.get("path") ?? "";

    const { data, error } = await supabase.storage
      .from("arts")
      .list(path, { limit: 1000 });

    if (error) throw error;

    const files: FileItem[] = (data ?? []).map((f) => ({
      name: f.name,
      path: path ? `${path}${f.name}` : f.name,
      isFolder: f.id === null
    }));

    return NextResponse.json(files);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
