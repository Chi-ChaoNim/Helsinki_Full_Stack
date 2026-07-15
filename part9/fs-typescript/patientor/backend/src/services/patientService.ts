import patientData from "../../data/patients.ts";
import type { Patient, NonSSNPatient, NewPatient } from "../../types.ts";
import { v1 as uuid } from "uuid";

const id: string = uuid();

const patients = patientData;

const getPatient = (): Patient[] => {
  return patients;
};

const getNonSSNPatient = (): NonSSNPatient[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatientEntry: Patient = {
    id,
    entries: [],
    ...entry,
  };
  patientData.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string): Patient | undefined => {
  const entry = patients.find((p) => p.id === id);
  return entry;
};

export default {
  getPatient,
  getNonSSNPatient,
  addPatient,
  findById,
};
