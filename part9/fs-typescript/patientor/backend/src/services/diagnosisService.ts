import diagnosisData from "../../data/diagnoses.ts";
import type { Diagnosis } from "../../types.ts";

const getDiagnosis = (): Diagnosis[] => {
  return diagnosisData;
};

export default {
  getDiagnosis,
};
