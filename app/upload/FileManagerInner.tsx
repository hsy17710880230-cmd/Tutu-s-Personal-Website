'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface BucketFile {
  name: string;
  path: string;
}

const isImage = (name: string) => {
  if (name.split(".")[0] == "title") return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
}

export default function FileManagerInner() {
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedUploadFolder, setSelectedUploadFolder] = useState('');
  const [newFolder, setNewFolder] = useState('');

  const [files, setFiles] = useState<FileList | null>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [bucketFiles, setBucketFiles] = useState<BucketFile[]>([]);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- Fetch folders ---------------- */
  const fetchFolders = async () => {
    const { data, error } = await supabase.storage.from('files').list('', {
      limit: 1000,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setFolders(
      data?.filter(item => item.metadata === null).map(item => item.name) || []
    );
  };

  /* ---------------- Fetch files ---------------- */
  const fetchFilesInFolder = async (folder: string) => {
    const { data, error } = await supabase.storage
      .from('files')
      .list(folder, { limit: 1000 });

    if (error) {
      setError(error.message);
      return;
    }

    setBucketFiles(
      data
        ?.filter(item => item.metadata && item.name !== '.keep' && item.name.split(".")[0] != "title")
        .map(item => ({
          name: item.name,
          path: `${folder}/${item.name}`,
        })) || []
    );
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) fetchFilesInFolder(selectedFolder);
    else setBucketFiles([]);
  }, [selectedFolder]);

  /* ---------------- Create folder ---------------- */
  const handleCreateFolder = async () => {
    if (!newFolder) return;

    const { error } = await supabase.storage
      .from('files')
      .upload(`${newFolder}/.keep`, new Blob(['']), { upsert: true });

    if (!error) {
      setNewFolder('');
      setMessage(`Folder "${newFolder}" created`);
      fetchFolders();
    }
  };

  /* ---------------- Upload ---------------- */
  const handleFiles = (list: FileList) => {
    setFiles(list);
    setFilePreviews(
      Array.from(list).map(file => URL.createObjectURL(file))
    );
  };

  const handleUpload = async () => {
    if (!files || !selectedUploadFolder) return;

    for (const file of Array.from(files)) {
      await supabase.storage
        .from('files')
        .upload(`${selectedUploadFolder}/${file.name}`, file, {
          upsert: true,
        });
    }

    setFiles(null);
    setFilePreviews([]);
    setMessage('Upload successful');
    fetchFilesInFolder(selectedFolder);
  };

  /* ---------------- Delete ---------------- */
  const handleDeleteFile = async (path: string) => {
    await supabase.storage.from('files').remove([path]);
    fetchFilesInFolder(selectedFolder);
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolder) return;

    const paths = bucketFiles.map(f => f.path);
    paths.push(`${selectedFolder}/.keep`);

    await supabase.storage.from('files').remove(paths);
    setSelectedFolder('');
    fetchFolders();
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="space-y-10">
      {/* Create Folder */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Create Folder</h3>
        <div className="flex gap-3">
          <input
            value={newFolder}
            onChange={e => setNewFolder(e.target.value)}
            placeholder="Folder name"
            className="w-full rounded-lg border px-3 py-2"
            maxLength={50}
          />
          <button
            onClick={handleCreateFolder}
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Create
          </button>
        </div>
      </section>

      {/* Upload */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Upload Files</h3>

        <select
          className="mb-3 w-full rounded-lg border px-3 py-2"
          value={selectedUploadFolder}
          onChange={e => setSelectedUploadFolder(e.target.value)}
        >
          <option value="">Select folder</option>
          {folders.map(f => (
            <option key={f}>{f}</option>
          ))}
        </select>

        <input
          type="file"
          multiple
          onChange={e => e.target.files && handleFiles(e.target.files)}
        />

        <div
          className="mt-4 rounded-xl border-2 border-dashed p-6 text-center text-sm text-gray-500"
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            e.dataTransfer.files && handleFiles(e.dataTransfer.files);
          }}
        >
          Drag & drop files here
        </div>

        {filePreviews.length > 0 && (
          <div className="mt-4 flex gap-3">
            {filePreviews.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="preview"
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        <button
          onClick={handleUpload}
          className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
        >
          Upload
        </button>
      </section>

      {/* Manage */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Manage Files</h3>

        <select
          className="mb-4 w-full rounded-lg border px-3 py-2"
          value={selectedFolder}
          onChange={e => setSelectedFolder(e.target.value)}
        >
          <option value="">Select folder</option>
          {folders.map(f => (
            <option key={f}>{f}</option>
          ))}
        </select>

        {selectedFolder && (
          <>
            <button
              onClick={handleDeleteFolder}
              className="mb-4 rounded-lg border border-red-500 px-3 py-1 text-sm text-red-600"
            >
              Delete Folder
            </button>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bucketFiles.map(file => (
                <div
                  key={file.path}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  {/* 🔍 Preview */}
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg border bg-gray-100">
                      {isImage(file.name) ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${file.path}`}
                          alt={file.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-500">
                          FILE
                        </div>
                      )}
                    </div>

                    <span className="max-w-[220px] truncate text-sm">
                      {file.name}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteFile(file.path)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
    </div>
  );
}
