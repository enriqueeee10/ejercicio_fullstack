import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import { notesApi } from "../services/notesApi";
import type { Note, CreateNotePayload, UpdateNotePayload } from "../types/Note";

const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && id) {
      const fetchNote = async () => {
        setLoading(true);
        setError(null);
        try {
          const fetchedNote = await notesApi.getNoteById(id);
          setNote(fetchedNote);
        } catch (err) {
          setError("Error al cargar la nota.");
          console.error("Error fetching note:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchNote();
    } else {
      setLoading(false); // No hay nota que cargar si es una nueva
    }
  }, [id, isEditing]);

  const handleSubmit = async (
    payload: CreateNotePayload | UpdateNotePayload
  ) => {
    if (isEditing && id) {
      await notesApi.updateNote(id, payload as UpdateNotePayload);
    } else {
      await notesApi.createNote(payload as CreateNotePayload);
    }
  };

  if (loading)
    return <div className="text-center mt-8 text-lg">Cargando nota...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500 text-lg">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <NoteForm
        initialNote={note}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />
    </div>
  );
};

export default NoteDetailPage;
