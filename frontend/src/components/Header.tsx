import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Tag, Archive, BookOpen } from "lucide-react"; // Importa iconos de Lucide React

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-green-500 to-blue-500 p-4 shadow-xl rounded-b-xl animate-fade-in">
      <nav className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <Link
          to="/"
          className="text-black text-3xl font-extrabold tracking-tight rounded-lg hover:bg-white hover:bg-opacity-20 p-2 transition-all duration-300 transform hover:scale-105"
        >
          <BookOpen className="inline-block mr-2" size={32} /> Mis Notas
        </Link>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/active"
            className="text-black text-lg font-medium px-4 py-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <BookOpen className="inline-block mr-2" size={20} /> Activas
          </Link>
          <Link
            to="/archived"
            className="text-black text-lg font-medium px-4 py-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <Archive className="inline-block mr-2" size={20} /> Archivadas
          </Link>
          <Link
            to="/tags"
            className="text-black text-lg font-medium px-4 py-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <Tag className="inline-block mr-2" size={20} /> Gestionar Etiquetas
          </Link>
          <Link
            to="/new"
            className="bg-green-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-100 transition-all duration-300 font-semibold flex items-center transform hover:scale-105 animate-pop-in"
          >
            <PlusCircle className="inline-block mr-2" size={20} /> Nueva Nota
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
