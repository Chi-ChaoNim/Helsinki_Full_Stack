import express, { type Response, type Request } from "express";

import patientService from "../services/patientService.ts";
import {
  type NewPatient,
  type NonSSNPatient,
  type Patient,
} from "../../types.ts";
import { errorMiddleware, newPatientParser } from "../middleware.ts";

const router = express.Router();

router.get("/", (_req, res: Response<NonSSNPatient[]>) => {
  const data = patientService.getNonSSNPatient();
  res.send(data);
});

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedEntry = patientService.addPatient(req.body);
    res.json(addedEntry);
  },
);

router.use(errorMiddleware);

export default router;
