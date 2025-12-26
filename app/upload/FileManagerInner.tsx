'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BucketFile {
  name: string;
  path: string;
}

const FileManagerInner: React.FC = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedUploadFolder, setSelectedUploadFolder] = useState('');
  const [newFolder, setNewFolder] = useState('');

  const [files, setFiles] = useState<FileList | null>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [bucketFiles, setBucketFiles] = useState<BucketFile[]>([]);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* -----------------------------
     Fetch folders
  ------------------------------ */
  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .list('', { limit: 1000 });

      if (error) throw error;

      setFolders(
        data?.filter(item => item.metadata === null).map(item => item.name) || []
      );
      setError(null);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch folders');
    }
  };

  /* -----------------------------
     Fetch files in folder
  ------------------------------ */
  const fetchFilesInFolder = async (folder: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .list(folder, { limit: 1000 });

      if (error) throw error;

      setBucketFiles(
        data
          ?.filter(item => item.metadata !== null && item.name !== '.keep')
          .map(item => ({
            name: item.name,
            path: `${folder}/${item.name}`,
          })) || []
      );
      setError(null);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch files');
    }
  };

  /* -----------------------------
     Hooks (ALWAYS RUN)
  ------------------------------ */
  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    selectedFolder
      ? fetchFilesInFolder(selectedFolder)
      : setBucketFiles([]);
  }, [selectedFolder]);

  /* -----------------------------
     Create folder
  ------------------------------ */
  const handleCreateFolder = async () => {
    if (!newFolder) {
      setError('Folder name is required');
      return;
    }

    try {
      const { error } = await supabase.storage
        .from('files')
        .upload(`${newFolder}/.keep`, new Blob(['']), { upsert: true });

      if (error) throw error;

      setNewFolder('');
      setMessage(`Folder "${newFolder}" created`);
      setError(null);
      fetchFolders();
    } catch (err) {
      setError((err as Error).message || 'Failed to create folder');
    }
  };

  /* -----------------------------
     File select & drag/drop
  ------------------------------ */
  const handleFiles = (fileList: FileList) => {
    setFiles(fileList);
    setFilePreviews(
      Array.from(fileList).map(file => URL.createObjectURL(file))
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  /* -----------------------------
     Upload
  ------------------------------ */
  const handleUpload = async () => {
    if (!files || !selectedUploadFolder) {
      setError('Select a folder and files first');
      return;
    }

    try {
      for (const file of Array.from(files)) {
        const { error } = await supabase.storage
          .from('files')
          .upload(`${selectedUploadFolder}/${file.name}`, file, { upsert: true });

        if (error) throw error;
      }

      setFiles(null);
      setFilePreviews([]);
      setMessage('Upload successful');
      setError(null);
      fetchFilesInFolder(selectedFolder);
    } catch (err) {
      setError((err as Error).message || 'Upload failed');
    }
  };

  /* -----------------------------
     Delete file
  ------------------------------ */
  const handleDeleteFile = async (path: string) => {
    try {
      const { error } = await supabase.storage.from('files').remove([path]);
      if (error) throw error;

      setMessage('File deleted');
      setError(null);
      fetchFilesInFolder(selectedFolder);
    } catch (err) {
      setError((err as Error).message || 'Failed to delete file');
    }
  };

  /* -----------------------------
     Delete folder
  ------------------------------ */
  const handleDeleteFolder = async () => {
    if (!selectedFolder) return;

    try {
      const paths = bucketFiles.map(f => f.path);
      paths.push(`${selectedFolder}/.keep`);

      const { error } = await supabase.storage.from('files').remove(paths);
      if (error) throw error;

      setSelectedFolder('');
      setMessage(`Folder "${selectedFolder}" deleted`);
      setError(null);
      fetchFolders();
    } catch (err) {
      setError((err as Error).message || 'Failed to delete folder');
    }
  };

  /* -----------------------------
     Render
  ------------------------------ */
  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h2>Admin File Manager</h2>

      {/* Create Folder */}
      <section>
        <h3>Create Folder</h3>
        <input
          value={newFolder}
          onChange={e => setNewFolder(e.target.value)}
          placeholder="Folder name"
        />
        <button onClick={handleCreateFolder} className='btn'>Create</button>
      </section>

      {/* Upload */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Upload Files</h3>

        <select
          value={selectedUploadFolder}
          onChange={e => setSelectedUploadFolder(e.target.value)}
        >
          <option value="">Select folder</option>
          {folders.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <input type="file" multiple onChange={handleFileChange} />

        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            border: '2px dashed gray',
            padding: '2rem',
            marginTop: '1rem',
          }}
        >
          Drag & drop files here
        </div>

        {filePreviews.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {filePreviews.map((src, i) => (
              <img key={i} src={src} style={{ width: 100 }} />
            ))}
          </div>
        )}

        <button onClick={handleUpload} style={{ marginTop: '1rem' }} className='btn'>
          Upload
        </button>
      </section>

      {/* List / Delete */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Manage Files</h3>

        <select
          value={selectedFolder}
          onChange={e => setSelectedFolder(e.target.value)}
        >
          <option value="">Select folder</option>
          {folders.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {selectedFolder && (
          <>
            <button
              onClick={handleDeleteFolder}
              style={{ color: 'red', marginLeft: '1rem' }}
              className='btn'
            >
              Delete Folder
            </button>

            <ul style={{ marginTop: '1rem' }}>
              {bucketFiles.map(file => (
                <li key={file.path}>
                  {file.name}
                  <button
                    onClick={() => handleDeleteFile(file.path)}
                    style={{ color: 'red', marginLeft: '1rem' }}
                    className='btn'
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Messages */}
      {error && (
        <p style={{ color: 'red', fontWeight: 'bold', marginTop: '1rem' }}>
          {error}
        </p>
      )}

      {message && (
        <p style={{ color: 'green', fontWeight: 'bold', marginTop: '1rem' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default FileManagerInner;
