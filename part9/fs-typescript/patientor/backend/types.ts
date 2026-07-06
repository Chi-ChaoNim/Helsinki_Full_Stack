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

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
};

export type Gender = (typeof Gender)[keyof typeof Gender];

export type NonSSNPatient = Omit<Patient, "ssn">;

export type NewPatient = Omit<Patient, "id">;
