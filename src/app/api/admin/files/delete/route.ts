import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { requireAdmin } from "@/src/lib/admin";

interface DeleteBody {
  path: string;
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    await requireAdmin(token);

    const body: DeleteBody = await req.json();
    if (!body.path) throw new Error("Path missing");

    const { error } = await supabase.storage.from("arts").remove([body.path]);
    if (error) throw error;

    return NextResponse.json({ message: "File deleted" });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
