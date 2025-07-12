import React, { useState, useEffect } from "react";
import type {
  CreateNotePayload,
  UpdateNotePayload,
  Note,
  Tag,
} from "../types/Note";
import { useNavigate } from "react-router-dom";
import TagInput from "./TagInput"; // Importa TagInput
import { notesApi } from "../services/notesApi"; // Para obtener todas las tags
import { Save, XCircle } from "lucide-react"; // Importa iconos

interface NoteFormProps {
  initialNote?: Note; // Para editar
  onSubmit: (payload: CreateNotePayload | UpdateNotePayload) => Promise<void>;
  isEditing?: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({
  initialNote,
  onSubmit,
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialNote?.tags || []
  );
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content || "");
      setSelectedTags(initialNote.tags || []);
    }
    const fetchAvailableTags = async () => {
      try {
        const tags = await notesApi.getAllTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error("Error fetching available tags:", err);
      }
    };
    fetchAvailableTags();
  }, [initialNote]);

  const handleAddTag = (tagName: string) => {
    const existingTag = availableTags.find(
      (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
    );
    if (existingTag && !selectedTags.some((tag) => tag.id === existingTag.id)) {
      setSelectedTags((prev) => [...prev, existingTag]);
    } else if (
      !selectedTags.some(
        (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
      )
    ) {
      // Si no existe, crea una "tag temporal" para mostrarla en el input
      // El ID temporal es solo para React key, el backend lo manejará por nombre
      setSelectedTags((prev) => [
        ...prev,
        { id: `new-${Date.now()}-${tagName}`, name: tagName },
      ]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const payload: CreateNotePayload | UpdateNotePayload = {
        title,
        content,
        tags: selectedTags.map((tag) => tag.name), // Envía solo los nombres de las tags al backend
      };
      await onSubmit(payload);
      navigate(initialNote?.isArchived ? "/archived" : "/active");
    } catch (err) {
      setError("Error al guardar la nota. Inténtalo de nuevo.");
      console.error("Error saving note:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card p-8 rounded-xl shadow-2xl max-w-xl mx-auto mt-8 animate-slide-in-right border border-gray-200"
    >
      <h2 className="text-3xl font-extrabold text-primary mb-8 text-center">
        {isEditing ? "Editar Nota" : "Crear Nueva Nota"}
      </h2>
      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 border border-red-200 animate-fade-in">
          {error}
        </p>
      )}
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block text-textSecondary text-sm font-bold mb-2"
        >
          Título:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-textPrimary leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="content"
          className="block text-textSecondary text-sm font-bold mb-2"
        >
          Contenido:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-textPrimary leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-y"
        ></textarea>
      </div>

      <TagInput
        selectedTags={selectedTags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        availableTags={availableTags}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-secondary hover:from-secondary hover:to-green-600 text-black font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? (
            "Guardando..."
          ) : isEditing ? (
            <>
              {" "}
              <Save size={20} /> Actualizar Nota{" "}
            </>
          ) : (
            <>
              {" "}
              <Save size={20} /> Crear Nota{" "}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
          disabled={isLoading}
        >
          <XCircle size={20} /> Cancelar
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
