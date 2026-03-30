import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { requireAdmin } from "@/src/lib/admin";

interface RenameBody {
  oldPath: string;
  newPath: string;
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    await requireAdmin(token);

    const body: RenameBody = await req.json();
    if (!body.oldPath || !body.newPath) throw new Error("Paths missing");

    // Copy to new path
    const { error: copyError } = await supabase.storage
      .from("arts")
      .copy(body.oldPath, body.newPath);
    if (copyError) throw copyError;

    // Remove old file
    const { error: removeError } = await supabase.storage
      .from("arts")
      .remove([body.oldPath]);
    if (removeError) throw removeError;

    return NextResponse.json({ message: "File renamed" });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
