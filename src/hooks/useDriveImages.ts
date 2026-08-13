/// <reference types="vite/client" />
import { useState, useEffect, useCallback } from 'react';
import { DriveImage } from '../types';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export function useDriveImages(folderId?: string) {
  const [images, setImages] = useState<DriveImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async (isPolling = false) => {
    if (!folderId) {
      setImages([]);
      return;
    }

    if (!isPolling) {
      setLoading(true);
      setError(null);
    }
    
    if (!API_KEY) {
      setError("Google API Key is missing. Please configure VITE_GOOGLE_API_KEY.");
      setLoading(false);
      return;
    }

    try {
      // Query to get only images inside the specified folder
      const q = `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`;
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,thumbnailLink,description)&key=${API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Failed to fetch images");
      }
      
      if (data.files) {
        setImages(data.files);
      } else {
        setImages([]);
      }
    } catch (err: any) {
      if (!isPolling) {
        setError(err.message || "An unexpected error occurred");
        setImages([]);
      }
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
    }
  }, [folderId]);

  useEffect(() => {
    fetchImages();

    if (folderId) {
      // Auto-refresh every 10 seconds to fetch new images
      const interval = setInterval(() => {
        fetchImages(true);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [fetchImages, folderId]);

  return { images, loading, error };
}
