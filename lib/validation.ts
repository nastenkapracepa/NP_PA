import { z } from 'zod';
import { NoteType } from '../types';

export const NoteFormSchema = z.object({
  type: z.nativeEnum(NoteType),
  text: z.string().trim()
    .min(10, { message: "Text inzerátu musí mít alespoň 10 znaků." })
    .max(500, { message: "Text inzerátu může mít maximálně 500 znaků." }),
  email: z.string().email({ message: "Zadejte prosím platnou emailovou adresu." }),
  tel: z.string().trim()
    .min(9, { message: "Telefonní číslo musí mít alespoň 9 znaků." })
    .regex(/^[+]?[\d\s]+$/, { message: "Zadejte prosím platné telefonní číslo." }),
  linkedin: z.string().url({ message: "Zadejte prosím platnou URL adresu LinkedIn profilu." }).optional().or(z.literal('')),
});

export type NewNotePayload = z.infer<typeof NoteFormSchema>;
