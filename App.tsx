import React, { useState, useMemo } from 'react';
import { Board } from './components/Board';
import { AddNoteForm } from './components/AddNoteForm';
import { Note, NoteType } from './types';

const INITIAL_NOTES: Note[] = [
  { id: '1', type: NoteType.OFFERING, text: 'Zkušeného React vývojáře na HPP', email: 'dev@firma.cz', tel: '123 456 789', creatorId: 'user-abc-123' },
  { id: '2', type: NoteType.DEMANDING, text: 'Práci jako zahradník na víkendy', email: 'jan@zahrada.cz', tel: '987 654 321', linkedin: 'https://linkedin.com/in/jannovak', creatorId: 'user-def-456' },
  { id: '3', type: NoteType.OFFERING, text: 'Brigádu v kavárně v centru Prahy', email: 'info@kavarna.cz', tel: '555 111 222', creatorId: 'user-ghi-789' },
  { id: '4', type: NoteType.DEMANDING, text: 'Stáž v oblasti marketingu', email: 'student@email.cz', tel: '444 555 666', creatorId: 'user-jkl-012' },
  { id: '5', type: NoteType.OFFERING, text: 'Grafika pro tvorbu loga', email: 'design@studio.com', tel: '777 888 999', linkedin: 'https://linkedin.com/in/grafik', creatorId: 'user-mno-345' },
  { id: '6', type: NoteType.OFFERING, text: 'Úklid domácnosti, 2x týdně', email: 'uklid@sluzby.cz', tel: '606 707 808', creatorId: 'user-pqr-678' },
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
  const userId = useMemo(() => getUserId(), []);

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
    <div className="min-h-screen font-sans text-gray-800">
      <header className="py-8 text-center">
        <h1 className="text-5xl font-bold text-stone-700 tracking-tight" style={{fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>
          Nástěnka Práce
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Jednoduché místo pro nabídku a poptávku práce
        </p>
      </header>

      <main className="container mx-auto px-4 pb-12">
        <AddNoteForm onAddNote={handleAddNote} />
        <Board notes={notes} onDeleteNote={handleDeleteNote} currentUserId={userId} />
      </main>
    </div>
  );
};

export default App;
