import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { requireAdmin } from "@/src/lib/admin";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    await requireAdmin(token);

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const path = form.get("path") as string | null;

    if (!file || !path) throw new Error("File or path missing");

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from("arts").upload(path, buffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

    if (error) throw error;

    return NextResponse.json({ message: "File uploaded" });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
