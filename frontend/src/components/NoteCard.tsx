import React from "react";
import type { Note } from "../types/Note";
import { Link } from "react-router-dom";
import { Edit, Archive, Trash2, RotateCcw, Tag } from "lucide-react"; // Importa iconos

interface NoteCardProps {
  note: Note;
  onArchiveToggle: (id: string, isArchived: boolean) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onArchiveToggle,
  onDelete,
}) => {
  const cardClasses = `
    bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between border-l-4
    ${
      note.isArchived
        ? "border-yellow-500 bg-yellow-50"
        : "border-primary bg-blue-50"
    }
    transform hover:-translate-y-1 animate-fade-in
  `;

  const tagClasses = `
    bg-purple-200 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm
  `;

  const buttonBaseClasses = `
    px-4 py-2 rounded-full transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-2
    hover:scale-105 transform
  `;

  return (
    <div className={cardClasses}>
      <div>
        <h3 className="text-2xl font-bold text-textPrimary mb-2 leading-tight">
          {note.title}
        </h3>
        <p className="text-textSecondary text-sm mb-4 line-clamp-4">
          {note.content || "Sin contenido"}
        </p>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag) => (
              <span key={tag.id} className={tagClasses}>
                <Tag size={14} className="inline-block mr-1" /> {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 mt-4 justify-end">
        <Link
          to={`/edit/${note.id}`}
          className={`${buttonBaseClasses} bg-blue-600 text-white hover:bg-blue-700 shadow-md`}
        >
          <Edit size={18} /> Editar
        </Link>
        <button
          onClick={() => onArchiveToggle(note.id, !note.isArchived)}
          className={`${buttonBaseClasses} ${
            note.isArchived
              ? "bg-yellow-600 text-white hover:bg-yellow-700 shadow-md"
              : "bg-green-600 text-white hover:bg-green-700 shadow-md"
          }`}
        >
          {note.isArchived ? <RotateCcw size={18} /> : <Archive size={18} />}
          {note.isArchived ? "Desarchivar" : "Archivar"}
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className={`${buttonBaseClasses} bg-red-600 text-white hover:bg-red-700 shadow-md`}
        >
          <Trash2 size={18} /> Eliminar
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-right">
        Última actualización: {new Date(note.updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default NoteCard;
