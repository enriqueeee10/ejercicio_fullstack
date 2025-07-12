import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import ActiveNotesPage from "./pages/ActiveNotesPage";
import ArchivedNotesPage from "./pages/ArchivedNotesPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import TagManagementPage from "./pages/TagManagementPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background font-inter">
        <Header />
        <main className="py-8 px-4">
          <Routes>
            <Route path="/" element={<Navigate to="/active" replace />} />
            <Route path="/active" element={<ActiveNotesPage />} />
            <Route path="/archived" element={<ArchivedNotesPage />} />
            <Route path="/new" element={<NoteDetailPage />} />
            <Route path="/edit/:id" element={<NoteDetailPage />} />
            <Route path="/tags" element={<TagManagementPage />} />
            {/* Puedes añadir una ruta 404 si lo deseas */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
