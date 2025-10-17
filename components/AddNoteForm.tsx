import React, { useState, useEffect, useCallback } from 'react';
import { NoteType } from '../types';
import { z } from 'zod';
import { NoteFormSchema, NewNotePayload } from '../lib/validation';

interface AddNoteFormProps {
  onAddNote: (note: NewNotePayload) => void;
}

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1.172a2 2 0 00.586 1.414l2.828 2.828a2 2 0 002.828 0l2.828-2.828A2 2 0 0015 4.172V3a1 1 0 10-2 0v.172a.5.5 0 01-.146.354l-2.828 2.828a.5.5 0 01-.708 0L6.464 3.526A.5.5 0 016.318 3.172V3a1 1 0 00-1-1zM2 11.5a1.5 1.5 0 013 0v1.586a2 2 0 00.586 1.414l1.414 1.414a2 2 0 002.828 0l1.414-1.414a2 2 0 00.586-1.414V11.5a1.5 1.5 0 013 0v1.586a5 5 0 01-1.464 3.536l-1.414 1.414a5 5 0 01-7.072 0L3.464 16.622A5 5 0 012 13.086V11.5z" clipRule="evenodd" />
  </svg>
)


export const AddNoteForm: React.FC<AddNoteFormProps> = ({ onAddNote }) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<NoteType>(NoteType.OFFERING);
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<z.ZodFormattedError<NewNotePayload> | null>(null);
  
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captcha, setCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const generateCaptcha = useCallback(() => {
    setNum1(Math.ceil(Math.random() * 10));
    setNum2(Math.ceil(Math.random() * 10));
    setCaptcha('');
    setCaptchaError('');
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleGenerateText = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error('Nepodařilo se vylepšit text.');
      }
      const data = await response.json();
      if (data.text) {
        setText(data.text);
      }
    } catch (error) {
      console.error('Error generating text:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setCaptchaError('');

    if (parseInt(captcha, 10) !== num1 + num2) {
      setCaptchaError('Špatná odpověď! Zkuste to znovu.');
      generateCaptcha();
      return;
    }

    const formData = { text, type, email, tel, linkedin };
    const validationResult = NoteFormSchema.safeParse(formData);

    if (!validationResult.success) {
      setErrors(validationResult.error.format());
      return;
    }

    if (!isSubmitted) {
      onAddNote(validationResult.data);
      setText('');
      setType(NoteType.OFFERING);
      setEmail('');
      setTel('');
      setLinkedin('');
      generateCaptcha();

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="mb-12 max-w-lg mx-auto bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-black/10">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-lg font-medium text-stone-700 mb-2">
            Typ inzerátu
          </label>
          <div className="flex items-center space-x-6">
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
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="note-text" className="block text-lg font-medium text-stone-700">
              Text inzerátu
            </label>
            <button
              type="button"
              onClick={handleGenerateText}
              disabled={isGenerating || !text.trim()}
              className="flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-900 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors"
              title="Vylepšit text pomocí AI"
            >
              <SparklesIcon className={`w-5 h-5 ${isGenerating ? 'animate-pulse' : ''}`} />
              {isGenerating ? 'Vylepšuji...' : 'Vylepšit text s AI'}
            </button>
          </div>
          <textarea
            id="note-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="např. Zkušeného Java vývojáře..."
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out text-base"
            rows={3}
          />
          {errors?.text?._errors[0] && <p className="text-red-600 text-sm mt-1">{errors.text._errors[0]}</p>}
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
          />
          {errors?.email?._errors[0] && <p className="text-red-600 text-sm mt-1">{errors.email._errors[0]}</p>}
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
          />
          {errors?.tel?._errors[0] && <p className="text-red-600 text-sm mt-1">{errors.tel._errors[0]}</p>}
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
          {errors?.linkedin?._errors[0] && <p className="text-red-600 text-sm mt-1">{errors.linkedin._errors[0]}</p>}
        </div>

        <div className="pt-2">
            <label className="block text-lg font-medium text-stone-700 mb-1">
                Ověření (ochrana proti robotům):
            </label>
            <div className="flex items-center gap-4">
                <span className="text-lg text-stone-800 font-medium">Kolik je {num1} + {num2} ?</span>
                <input
                    id="captcha"
                    type="number"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    className="w-24 px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out text-base"
                    required
                />
            </div>
            {captchaError && <p className="text-red-600 text-sm mt-1">{captchaError}</p>}
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