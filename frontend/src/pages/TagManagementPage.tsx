import React, { useEffect, useState, useCallback } from "react";
import { notesApi } from "../services/notesApi";
import type { Tag } from "../types/Note";
import { Tag as TagIcon, Trash2, Loader2 } from "lucide-react"; // Importa iconos

const TagManagementPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null); // Para estado de carga individual

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTags = await notesApi.getAllTags();
      setTags(fetchedTags);
    } catch (err) {
      setError("Error al cargar las etiquetas.");
      console.error("Error fetching tags:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleDeleteTag = async (tagId: string) => {
    setDeleteMessage(null);
    setError(null);
    setDeletingTagId(tagId); // Establece el ID de la etiqueta que se está eliminando
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar esta etiqueta? Si la etiqueta está asociada a alguna nota, no se podrá eliminar."
      )
    ) {
      try {
        await notesApi.deleteTag(tagId);
        setDeleteMessage("Etiqueta eliminada exitosamente.");
        fetchTags(); // Volver a cargar las etiquetas después de la eliminación
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Error al eliminar la etiqueta.";
        setError(errorMessage);
        console.error("Error deleting tag:", err);
      } finally {
        setDeletingTagId(null); // Restablece el ID de la etiqueta que se está eliminando
      }
    } else {
      setDeletingTagId(null); // Si el usuario cancela, restablece el ID
    }
  };

  if (loading)
    return (
      <div className="text-center mt-8 text-lg text-textSecondary">
        Cargando etiquetas...
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-8 text-red-500 text-lg animate-fade-in">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-card rounded-xl shadow-2xl animate-fade-in border border-gray-200">
      <h1 className="text-3xl font-extrabold text-primary mb-8 text-center flex items-center justify-center gap-3">
        <TagIcon size={32} /> Gestionar Etiquetas
      </h1>
      {deleteMessage && (
        <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center border border-green-200 animate-fade-in">
          {deleteMessage}
        </p>
      )}
      {tags.length === 0 ? (
        <div className="text-center text-textSecondary text-lg p-6 bg-gray-50 rounded-lg shadow-inner">
          No hay etiquetas creadas aún.
        </div>
      ) : (
        <ul className="space-y-4">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] animate-slide-in-right border border-gray-100"
            >
              <span className="text-xl font-semibold text-textPrimary mb-2 sm:mb-0 flex items-center gap-2">
                <TagIcon size={20} className="text-primary" /> {tag.name}
              </span>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                disabled={deletingTagId === tag.id}
              >
                {deletingTagId === tag.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                {deletingTagId === tag.id ? "Eliminando..." : "Eliminar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagManagementPage;
