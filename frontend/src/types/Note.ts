export interface Tag {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[]; // Array de objetos Tag
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tags?: string[]; // Array de nombres de tags
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
  isArchived?: boolean;
  tags?: string[]; // Array de nombres de tags
}
