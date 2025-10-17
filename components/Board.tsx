import React from 'react';
import { Note as INote, NoteType } from '../types';
import { Note } from './Note';

interface BoardProps {
  notes: INote[];
  onDeleteNote: (id: string) => void;
  currentUserId: string;
  isAdmin: boolean;
}

export const Board: React.FC<BoardProps> = ({ notes, onDeleteNote, currentUserId, isAdmin }) => {
  const offeringNotes = notes.filter(note => note.type === NoteType.OFFERING);
  const demandingNotes = notes.filter(note => note.type === NoteType.DEMANDING);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
      {/* Offering Section */}
      <section>
        <h2 
            className="text-4xl font-bold text-stone-700 mb-6 text-center pb-2 border-b-4 border-green-400" 
        >
            {NoteType.OFFERING}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {offeringNotes.map((note, index) => (
            <Note key={note.id} note={note} index={index} onDelete={onDeleteNote} currentUserId={currentUserId} isAdmin={isAdmin} />
          ))}
          {offeringNotes.length === 0 && <p className="text-center text-stone-500 col-span-full mt-8">Zatím zde nejsou žádné nabídky.</p>}
        </div>
      </section>

      {/* Demanding Section */}
      <section>
        <h2 
            className="text-4xl font-bold text-stone-700 mb-6 text-center pb-2 border-b-4 border-blue-400"
        >
            {NoteType.DEMANDING}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {demandingNotes.map((note, index) => (
            <Note key={note.id} note={note} index={index} onDelete={onDeleteNote} currentUserId={currentUserId} isAdmin={isAdmin} />
          ))}
          {demandingNotes.length === 0 && <p className="text-center text-stone-500 col-span-full mt-8">Zatím zde nejsou žádné poptávky.</p>}
        </div>
      </section>
    </div>
  );
};