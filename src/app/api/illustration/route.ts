import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase"; // adjust path if needed

export async function GET() {
  const root = "illustration";

  try {
    const { data: folders, error } = await supabase.storage
      .from("arts")
      .list(root, { limit: 1000 });

    if (error || !folders) {
      throw error;
    }

    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/arts`;

    const folderData = await Promise.all(
      folders
        .filter((item) => item.id === null) // folders only
        .map(async (folder) => {
          const { data: files } = await supabase.storage
            .from("arts")
            .list(`${root}/${folder.name}`, { limit: 1000 });

          const images =
            files
              ?.filter((file) => /\.(png)$/i.test(file.name))
              .map(
                (file) =>
                  `${baseUrl}/${root}/${folder.name}/${file.name}`
              ) ?? [];

          return {
            folder: folder.name,
            images,
          };
        })
    );

    folderData.sort((a, b) => b.folder.localeCompare(a.folder));

    return NextResponse.json(folderData);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read folders" },
      { status: 500 }
    );
  }
}
