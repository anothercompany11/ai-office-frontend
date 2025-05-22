export interface Folder {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  instruction?: string;
}

export interface CreateFolderRequest {
  name: string;
  is_default?: boolean;
}

export interface UpdateFolderRequest {
  name?: string;
  is_default?: boolean;
  instruction?: string;
}

export interface FolderDetail extends Folder {
  conversations: {
    id: string;
    title: string;
    preview: string;
    created_at: string;
    updated_at: string;
  }[];
}
