import React, { useState } from 'react';
import { Note, NoteType } from '../types';

interface AddNoteFormProps {
  onAddNote: (note: Omit<Note, 'id' | 'creatorId'>) => void;
}

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

export const AddNoteForm: React.FC<AddNoteFormProps> = ({ onAddNote }) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<NoteType>(NoteType.OFFERING);
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && email.trim() && tel.trim() && !isSubmitted) {
      onAddNote({ text, type, email, tel, linkedin });
      setText('');
      setType(NoteType.OFFERING);
      setEmail('');
      setTel('');
      setLinkedin('');

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="mb-12 max-w-lg mx-auto bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-black/10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-6">
          <label className="block text-lg font-medium text-stone-700">
            Typ inzerátu
          </label>
          <div className="flex items-center space-x-4">
            {(Object.values(NoteType)).map((noteType) => (
              <label key={noteType} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="note-type"
                  value={noteType}
                  checked={type === noteType}
                  onChange={() => setType(noteType)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300"
                />
                <span className="font-medium text-lg">{noteType}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="note-text" className="block text-lg font-medium text-stone-700 mb-1">
            Text inzerátu
          </label>
          <textarea
            id="note-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="např. Zkušeného Java vývojáře..."
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out text-base"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-lg font-medium text-stone-700 mb-1">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="tel" className="block text-lg font-medium text-stone-700 mb-1">
            Tel.:
          </label>
          <input
            id="tel"
            type="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="linkedin" className="block text-lg font-medium text-stone-700 mb-1">
            LinkedIn (nepovinné):
          </label>
          <input
            id="linkedin"
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out text-base"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitted}
          className={`w-full text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out shadow-md text-xl ${
            isSubmitted
              ? 'bg-green-500 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500'
          }`}
        >
          {isSubmitted ? (
            <span className="flex items-center justify-center">
              <CheckIcon className="w-6 h-6 mr-2" />
              Přidáno!
            </span>
          ) : (
            'Přidat na nástěnku'
          )}
        </button>
      </form>
    </div>
  );
};