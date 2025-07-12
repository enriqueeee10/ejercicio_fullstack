import React, { useEffect, useState, useCallback } from "react";
import { notesApi } from "../services/notesApi";
import type { Note, Tag } from "../types/Note";
import NoteCard from "../components/NoteCard";
import TagFilter from "../components/TagFilter";

const ArchivedNotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const archivedNotes = await notesApi.getAllNotes(
        true,
        selectedFilterTags
      );
      setNotes(archivedNotes);
    } catch (err) {
      setError("Error al cargar las notas archivadas.");
      console.error("Error fetching archived notes:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedFilterTags]);

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
      <div className="text-center mt-8 text-lg">
        Cargando notas archivadas...
      </div>
    );
  if (error)
    return <div className="text-center mt-8 text-red-500 text-lg">{error}</div>;
  if (notes.length === 0)
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Notas Archivadas
        </h1>
        <TagFilter
          availableTags={availableTags}
          selectedFilterTags={selectedFilterTags}
          onTagFilterChange={handleTagFilterChange}
        />
        <div className="text-center mt-8 text-gray-600 text-lg">
          No hay notas archivadas que coincidan con los filtros.
        </div>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Notas Archivadas
      </h1>
      <TagFilter
        availableTags={availableTags}
        selectedFilterTags={selectedFilterTags}
        onTagFilterChange={handleTagFilterChange}
      />
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
    </div>
  );
};

export default ArchivedNotesPage;
