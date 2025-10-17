import React, { useState, useMemo, useEffect } from 'react';
import { Board } from './components/Board';
import { AddNoteForm } from './components/AddNoteForm';
import { Note, NoteType } from './types';

const INITIAL_NOTES: Note[] = [
  { id: '1', type: NoteType.OFFERING, text: 'Senior Backend Programátora (Java/Kotlin) do zavedeného FinTech startupu.', email: 'hr@fintech.io', tel: '123 456 789', linkedin: 'https://linkedin.com/in/fintech-hr', creatorId: 'user-abc-123' },
  { id: '2', type: NoteType.DEMANDING, text: 'Hledám pozici Product Ownera na částečný úvazek. Zkušenosti s agilním vývojem a JIRA.', email: 'petr.product@email.cz', tel: '987 654 321', linkedin: 'https://linkedin.com/in/petr-product', creatorId: 'user-def-456' },
  { id: '3', type: NoteType.OFFERING, text: 'Zkušeného Scrum Mastera pro 2-3 týmy. Nutná certifikace a praxe.', email: 'jobs@agilecorp.com', tel: '555 111 222', creatorId: 'user-ghi-789' },
  { id: '4', type: NoteType.DEMANDING, text: 'Junior Frontend vývojář (React, TypeScript) hledá první komerční zkušenost.', email: 'student.dev@email.cz', tel: '444 555 666', creatorId: 'user-jkl-012' },
  { id: '5', type: NoteType.OFFERING, text: 'DevOps inženýra se znalostí AWS, Kubernetes a Terraformu.', email: 'career@cloudmasters.com', tel: '777 888 999', linkedin: 'https://linkedin.com/in/cloud-career', creatorId: 'user-mno-345' },
  { id: '6', type: NoteType.DEMANDING, text: 'Zkušená UX/UI designérka hledá projekt v oblasti mobilních aplikací.', email: 'anna.design@portfolio.net', tel: '606 707 808', creatorId: 'user-pqr-678' },
];

const getUserId = (): string => {
  let userId = localStorage.getItem('jobBoardUserId');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('jobBoardUserId', userId);
  }
  return userId;
};

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = useMemo(() => getUserId(), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleAddNote = (newNote: Omit<Note, 'id' | 'creatorId'>) => {
    setNotes(prevNotes => [
      { ...newNote, id: new Date().toISOString(), creatorId: userId },
      ...prevNotes, 
    ]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };


  return (
    <div className="min-h-screen text-gray-800">
      <header className="py-8 text-center">
        <h1 className="text-5xl font-bold text-stone-700 tracking-tight">
          Nástěnka Práce
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Jednoduché místo pro nabídku a poptávku práce
        </p>
      </header>

      <main className="container mx-auto px-4 pb-12">
        <AddNoteForm onAddNote={handleAddNote} />
        <Board notes={notes} onDeleteNote={handleDeleteNote} currentUserId={userId} isAdmin={isAdmin} />
      </main>
    </div>
  );
};

export default App;