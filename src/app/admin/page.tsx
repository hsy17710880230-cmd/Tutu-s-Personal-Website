"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import TitleWithNav from "@/src/components/Title";

interface FileItem {
  name: string;
  path: string;
  isFolder: boolean;
}

export default function AdminPage() {
  const router = useRouter();

  const [session, setSession] = useState<string | null>(null);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        router.push("/auth");
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      const token = data.session?.access_token ?? null;
      if (!token) return;
      setSession(token);

      const res = await fetch(`/api/admin/files/list?path=`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list: FileItem[] = await res.json();
      if (cancelled) return;
      setFiles(list);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, sessionData) => {
        if (!sessionData) {
          router.push("/auth");
        } else {
          setSession(sessionData.access_token);
        }
      }
    );

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const loadFiles = useCallback(async (path = "") => {
    if (!session) return;

    const res = await fetch(`/api/admin/files/list?path=${path}`, {
      headers: { Authorization: `Bearer ${session}` },
    });
    const data: FileItem[] = await res.json();
    setFiles(data);
    setCurrentPath(path);
  }, [session]);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setUploadFiles(droppedFiles);
  };

  const handleUpload = async () => {
    if (!session || uploadFiles.length === 0) return;

    for (const file of uploadFiles) {
      const form = new FormData();
      form.append("file", file);
      form.append("path", `${currentPath}${file.name}`);

      await fetch("/api/admin/files/upload", {
        method: "POST",
        body: form,
        headers: { Authorization: `Bearer ${session}` },
      });
    }

    setUploadFiles([]);
    loadFiles(currentPath);
  };

  const handleDelete = async (path: string) => {
    if (!session) return;

    await fetch("/api/admin/files/delete", {
      method: "POST",
      body: JSON.stringify({ path }),
      headers: { Authorization: `Bearer ${session}` },
    });

    loadFiles(currentPath);
  };

  const handleRename = async (oldPath: string) => {
    if (!session) return;
    const newName = prompt("New name");
    if (!newName) return;
    const folder = oldPath.split("/").slice(0, -1).join("/");
    const newPath = folder ? `${folder}/${newName}` : newName;

    await fetch("/api/admin/files/rename", {
      method: "POST",
      body: JSON.stringify({ oldPath, newPath }),
      headers: { Authorization: `Bearer ${session}` },
    });

    loadFiles(currentPath);
  };

  const handleFolderClick = (path: string) => {
    loadFiles(path + "/");
  };

  const handleGoBack = () => {
    const segments = currentPath.split("/").filter(Boolean);
    segments.pop();
    const parent = segments.join("/") + (segments.length ? "/" : "");
    loadFiles(parent);
  };

  if (authLoading || !session) return null;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-6 flex flex-col">
      <TitleWithNav project="Admin Storage" />
      <button onClick={signOut} className="border px-4 py-2 w-fit">
        Logout
      </button>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed p-6 rounded-md flex flex-col items-center justify-center text-center space-y-2"
      >
        <p>Drag & drop files here to upload</p>
        {uploadFiles.length > 0 && (
          <>
            <ul className="text-sm">
              {uploadFiles.map((f) => (
                <li key={f.name}>{f.name}</li>
              ))}
            </ul>
            <button
              onClick={handleUpload}
              className="bg-black text-white px-4 py-2 mt-2"
            >
              Upload
            </button>
          </>
        )}
      </div>

      {currentPath && (
        <button
          onClick={handleGoBack}
          className="underline text-sm text-blue-600"
        >
          ← Go Back
        </button>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((f) => (
          <div key={f.path} className="border p-2 space-y-2">
            {f.isFolder ? (
              <div
                className="bg-gray-200 cursor-pointer p-4 text-center"
                onClick={() => handleFolderClick(f.path)}
              >
                📁 {f.name}
              </div>
            ) : (
              <>
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/arts/${f.path}`}
                  className="w-full"
                />
                <div className="text-sm">{f.path}</div>
                <div className="flex gap-2">
                  <button onClick={() => handleRename(f.path)}>Rename</button>
                  <button onClick={() => handleDelete(f.path)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
