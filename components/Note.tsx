import React from 'react';
import { Note as INote, NoteType } from '../types';

interface NoteProps {
  note: INote;
  index: number;
  onDelete: (id: string) => void;
  currentUserId: string;
}

const Pin: React.FC = () => (
    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <div className="w-5 h-5 bg-red-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-red-700 rounded-full"></div>
        </div>
    </div>
);

const TrashIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
)

const MailIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
)

const PhoneIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
)

const LinkedInIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
)

export const Note: React.FC<NoteProps> = ({ note, index, onDelete, currentUserId }) => {
  const rotationClasses = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1', 'rotate-3', '-rotate-3'];
  const rotation = rotationClasses[index % rotationClasses.length];

  const noteColor = note.type === NoteType.OFFERING ? 'bg-green-200' : 'bg-blue-200';
  const accentColor = note.type === NoteType.OFFERING ? 'border-green-400' : 'border-blue-400';
  
  const isOwner = note.creatorId === currentUserId;

  return (
    <div
      className={`relative p-4 pt-8 min-h-[16rem] flex flex-col justify-between transform transition-transform duration-150 hover:scale-105 hover:z-10 ${rotation}`}
      style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
    >
      <div className={`absolute inset-0 ${noteColor} shadow-lg rounded-sm border-t-8 ${accentColor}`}></div>
      <Pin />
      <div className="relative z-10 flex-grow overflow-y-auto flex flex-col">
        <p className="font-bold mb-2">{note.type}</p>
        <p className="text-gray-700 break-words flex-grow mb-2">{note.text}</p>
        <div className="border-t border-gray-400/50 pt-2 mt-auto space-y-1 text-sm">
            <div className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <a href={`mailto:${note.email}`} className="text-gray-700 hover:underline truncate">{note.email}</a>
            </div>
            <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span className="text-gray-700">{note.tel}</span>
            </div>
            {note.linkedin && (
                <div className="flex items-center gap-2">
                    <LinkedInIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <a href={note.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline truncate">LinkedIn profil</a>
                </div>
            )}
        </div>
      </div>
      {isOwner && (
        <button 
          onClick={() => onDelete(note.id)}
          className="absolute bottom-2 right-2 z-20 p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors duration-200"
          aria-label="Smazat poznámku"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
