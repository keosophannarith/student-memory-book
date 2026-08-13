/// <reference types="vite/client" />
import { useState, useEffect } from 'react';
import { DriveFolder } from '../types';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyB4E2PM8ueMmkfTaptHkr2VOT4UqoMpyjU';

export function useDriveFolders(parentId?: string) {
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!parentId) {
      setFolders([]);
      return;
    }

    const fetchFolders = async (isPolling = false) => {
      if (!isPolling) {
        setLoading(true);
        setError(null);
      }
      
      if (!API_KEY) {
        if (!isPolling) setLoading(false);
        return;
      }

      try {
        const q = `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed=false`;
        const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&key=${API_KEY}&orderBy=name`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message || "Failed to fetch folders");
        }
        
        if (data.files) {
          setFolders(data.files);
        } else {
          setFolders([]);
        }
      } catch (err: any) {
        if (!isPolling) {
          setError(err.message || "An unexpected error occurred");
          setFolders([]);
        }
      } finally {
        if (!isPolling) {
          setLoading(false);
        }
      }
    };

    fetchFolders();

    if (parentId) {
      // Auto-refresh every 10 seconds
      const interval = setInterval(() => {
        fetchFolders(true);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [parentId]);

  return { folders, loading, error };
}
