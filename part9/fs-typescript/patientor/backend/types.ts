import { z } from "zod";

export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export const Gender = {
  Male: "male",
  Female: "female",
  Other: "other",
} as const;

export const NewEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
});

export type Gender = (typeof Gender)[keyof typeof Gender];

export type NonSSNPatient = Omit<Patient, "ssn">;

export type NewPatient = z.infer<typeof NewEntrySchema>;

export interface Patient extends NewPatient {
  id: string;
}
