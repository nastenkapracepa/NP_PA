export enum NoteType {
  OFFERING = 'NABÍZÍM',
  DEMANDING = 'POPTÁVÁM',
}

export interface Note {
  id: string;
  type: NoteType;
  text: string;
  email: string;
  tel: string;
  linkedin?: string;
  creatorId: string;
}
