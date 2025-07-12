import React, { useState, type KeyboardEvent } from "react";
import type { Tag } from "../types/Note";
import { X, Tag as TagIcon } from "lucide-react"; // Importa iconos

interface TagInputProps {
  selectedTags: Tag[];
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagId: string) => void;
  availableTags: Tag[]; // Todas las tags existentes
}

const TagInput: React.FC<TagInputProps> = ({
  selectedTags,
  onAddTag,
  onRemoveTag,
  availableTags,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onAddTag(inputValue.trim());
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const handleAddTagFromSuggestion = (tagName: string) => {
    onAddTag(tagName);
    setInputValue("");
    setShowSuggestions(false);
  };

  const filteredSuggestions = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some((selected) => selected.id === tag.id)
  );

  return (
    <div className="mb-6">
      <label
        htmlFor="tags"
        className="block text-textSecondary text-sm font-bold mb-2"
      >
        Etiquetas (presiona Enter para agregar):
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="bg-violet-600 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center shadow-md animate-pop-in transition-all duration-200"
          >
            <TagIcon size={16} className="inline-block mr-1" /> {tag.name}
            <button
              type="button"
              onClick={() => onRemoveTag(tag.id)}
              className="ml-2 text-white hover:text-primary font-bold transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          id="tags"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Retraso para permitir clic en sugerencia
          className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-textPrimary leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          placeholder="Añadir nueva etiqueta..."
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-xl mt-2 max-h-48 overflow-y-auto animate-fade-in">
            {filteredSuggestions.map((tag) => (
              <li
                key={tag.id}
                onMouseDown={() => handleAddTagFromSuggestion(tag.name)} // Usar onMouseDown para evitar blur
                className="px-4 py-3 cursor-pointer hover:bg-violet-600 hover:text-white transition-colors duration-200 flex items-center gap-2"
              >
                <TagIcon size={16} /> {tag.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TagInput;
