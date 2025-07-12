import axios from "axios";
import type {
  Note,
  CreateNotePayload,
  UpdateNotePayload,
  Tag,
} from "../types/Note";

const API_URL = "http://localhost:3001/notes"; // URL de tu backend

export const notesApi = {
  async getAllNotes(
    isArchived?: boolean,
    filterTags?: string[]
  ): Promise<Note[]> {
    const params: any = {};
    if (isArchived !== undefined) {
      params.isArchived = isArchived;
    }
    if (filterTags && filterTags.length > 0) {
      params.tags = filterTags.join(","); // Envía tags como una cadena separada por comas
    }
    const response = await axios.get<Note[]>(API_URL, { params });
    return response.data;
  },

  async getNoteById(id: string): Promise<Note> {
    const response = await axios.get<Note>(`${API_URL}/${id}`);
    return response.data;
  },

  async createNote(payload: CreateNotePayload): Promise<Note> {
    const response = await axios.post<Note>(API_URL, payload);
    return response.data;
  },

  async updateNote(id: string, payload: UpdateNotePayload): Promise<Note> {
    const response = await axios.patch<Note>(`${API_URL}/${id}`, payload);
    return response.data;
  },

  async deleteNote(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },

  async archiveNote(id: string): Promise<Note> {
    const response = await axios.patch<Note>(`${API_URL}/${id}/archive`);
    return response.data;
  },

  async unarchiveNote(id: string): Promise<Note> {
    const response = await axios.patch<Note>(`${API_URL}/${id}/unarchive`);
    return response.data;
  },

  async getAllTags(): Promise<Tag[]> {
    const response = await axios.get<Tag[]>(`${API_URL}/tags/all`);
    return response.data;
  },

  // Nuevo método para eliminar una etiqueta
  async deleteTag(id: string): Promise<void> {
    await axios.delete(`${API_URL}/tags/${id}`);
  },
};
