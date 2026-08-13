/// <reference types="vite/client" />
import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export function useDriveFolderDocs(folderId?: string) {
  const [docText, setDocText] = useState<string>('');

  useEffect(() => {
    if (!folderId) {
      setDocText('');
      return;
    }

    const fetchDocs = async () => {
      if (!API_KEY) return;
      try {
        const q = `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed=false`;
        const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&key=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.files && data.files.length > 0) {
          // Export the first doc as plain text
          const docId = data.files[0].id;
          const exportUrl = `https://www.googleapis.com/drive/v3/files/${docId}/export?mimeType=text/plain&key=${API_KEY}`;
          const exportResponse = await fetch(exportUrl);
          const text = await exportResponse.text();
          setDocText(text);
        } else {
          setDocText('');
        }
      } catch (err) {
        console.error("Failed to fetch docs text:", err);
      }
    };

    fetchDocs();

    if (folderId) {
      // Auto-refresh every 10 seconds
      const interval = setInterval(() => {
        fetchDocs();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [folderId]);

  return { docText };
}
