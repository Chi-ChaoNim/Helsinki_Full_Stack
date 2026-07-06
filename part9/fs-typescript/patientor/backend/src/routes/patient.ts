import express, { type Response } from "express";
import patientService from "../services/patientService.ts";
import parseNewPatientEntry from "../utils.ts";
import type { NonSSNPatient } from "../../types.ts";

const router = express.Router();

router.get("/", (_req, res: Response<NonSSNPatient[]>) => {
  const data = patientService.getNonSSNPatient();
  res.send(data);
});

router.post("/", (req, res) => {
  try {
    const newPatientEntry = parseNewPatientEntry(req.body);
    const addedPatient = patientService.addPatient(newPatientEntry);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + errorMessage;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
