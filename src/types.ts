export interface DriveImage {
  id: string;
  name: string;
  thumbnailLink?: string;
  description?: string;
}

export interface DriveFolder {
  id: string;
  name: string;
}

export interface ScrapbookEntry {
  id: string;
  text: string;
  date: string;
}
