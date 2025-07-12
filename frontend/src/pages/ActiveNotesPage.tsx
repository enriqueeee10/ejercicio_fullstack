import React, { useEffect, useState, useCallback } from "react";
import { notesApi } from "../services/notesApi";
import type { Note, Tag } from "../types/Note";
import NoteCard from "../components/NoteCard";
import TagFilter from "../components/TagFilter"; // Importa TagFilter

const ActiveNotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const activeNotes = await notesApi.getAllNotes(false, selectedFilterTags);
      setNotes(activeNotes);
    } catch (err) {
      setError("Error al cargar las notas activas.");
      console.error("Error fetching active notes:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedFilterTags]); // Dependencia de selectedFilterTags

  const fetchAvailableTags = useCallback(async () => {
    try {
      const tags = await notesApi.getAllTags();
      setAvailableTags(tags);
    } catch (err) {
      console.error("Error fetching available tags:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    fetchAvailableTags();
  }, [fetchNotes, fetchAvailableTags]);

  const handleArchiveToggle = async (id: string, isArchived: boolean) => {
    try {
      if (isArchived) {
        await notesApi.archiveNote(id);
      } else {
        await notesApi.unarchiveNote(id);
      }
      fetchNotes();
    } catch (err) {
      setError("Error al cambiar el estado de la nota.");
      console.error("Error toggling archive status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      try {
        await notesApi.deleteNote(id);
        fetchNotes();
      } catch (err) {
        setError("Error al eliminar la nota.");
        console.error("Error deleting note:", err);
      }
    }
  };

  const handleTagFilterChange = (tagName: string, isSelected: boolean) => {
    setSelectedFilterTags((prev) =>
      isSelected ? [...prev, tagName] : prev.filter((tag) => tag !== tagName)
    );
  };

  if (loading)
    return (
      <div className="text-center mt-8 text-lg">Cargando notas activas...</div>
    );
  if (error)
    return <div className="text-center mt-8 text-red-500 text-lg">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Notas Activas
      </h1>
      <TagFilter
        availableTags={availableTags}
        selectedFilterTags={selectedFilterTags}
        onTagFilterChange={handleTagFilterChange}
      />
      {notes.length === 0 ? (
        <div className="text-center mt-8 text-gray-600 text-lg">
          No hay notas activas que coincidan con los filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onArchiveToggle={handleArchiveToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveNotesPage;
