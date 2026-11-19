import patientData from "../../data/patients.ts";
import type {
  Patient,
  NonSSNPatient,
  NewPatient,
  Entry,
  NewEntry,
} from "../../types.ts";
import { v1 as uuid } from "uuid";

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
    id: uuid(),
    entries: [],
    ...entry,
  };
  patientData.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (id: string, entry: NewEntry): Entry => {
  const patientToEdit = findById(id);
  const newEntry = {
    id: uuid(),
    ...entry,
  } as Entry;
  patientToEdit?.entries.push(newEntry);
  return newEntry;
};

const findById = (id: string): Patient | undefined => {
  const entry = patients.find((p) => p.id === id);
  return entry;
};

export default {
  getPatient,
  getNonSSNPatient,
  addPatient,
  addEntry,
  findById,
};
