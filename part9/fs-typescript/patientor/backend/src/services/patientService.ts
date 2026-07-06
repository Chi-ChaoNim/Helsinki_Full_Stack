import patientData from "../../data/patients.ts";
import type { Patient, NonSSNPatient, NewPatient } from "../../types.ts";
import { v1 as uuid } from "uuid";

const id: string = uuid();

const getPatient = (): Patient[] => {
  return patientData;
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
    ...entry,
  };
  patientData.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getPatient,
  getNonSSNPatient,
  addPatient,
};
