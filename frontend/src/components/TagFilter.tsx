import React from "react";
import type { Tag } from "../types/Note";
import { Filter } from "lucide-react"; // Importa icono

interface TagFilterProps {
  availableTags: Tag[];
  selectedFilterTags: string[];
  onTagFilterChange: (tagName: string, isSelected: boolean) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({
  availableTags,
  selectedFilterTags,
  onTagFilterChange,
}) => {
  return (
    <div className="mb-8 p-6 bg-card rounded-xl shadow-lg border border-gray-200 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
        <Filter size={24} /> Filtrar por Etiquetas:
      </h3>
      <div className="flex flex-wrap gap-3">
        {availableTags.length === 0 ? (
          <p className="text-textSecondary text-sm italic">
            No hay etiquetas disponibles para filtrar.
          </p>
        ) : (
          availableTags.map((tag) => (
            <label
              key={tag.id}
              className={`inline-flex items-center px-4 py-2 rounded-full cursor-pointer transition-all duration-200 text-sm font-semibold shadow-md
                ${
                  selectedFilterTags.includes(tag.name)
                    ? "bg-blue-100 text-black transform scale-105"
                    : "bg-white text-textSecondary hover:bg-gray-300 hover:text-black"
                }`}
            >
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-primary rounded mr-2 hidden" // Oculta el checkbox nativo
                checked={selectedFilterTags.includes(tag.name)}
                onChange={(e) => onTagFilterChange(tag.name, e.target.checked)}
              />
              <span className="relative flex items-center">
                {selectedFilterTags.includes(tag.name) && (
                  <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                )}
                {tag.name}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default TagFilter;
