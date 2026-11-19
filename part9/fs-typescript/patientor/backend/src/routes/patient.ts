import express, { type Response, type Request } from "express";

import patientService from "../services/patientService.ts";
import {
  type NewEntry,
  type NewPatient,
  // type NonSSNPatient,
  type Patient,
  type Entry,
} from "../../types.ts";
import {
  errorMiddleware,
  newPatientParser,
  newEntryParser,
} from "../middleware.ts";

const router = express.Router();

// router.get("/", (_req, res: Response<NonSSNPatient[]>) => {
//   const data = patientService.getNonSSNPatient();
//   res.send(data);
// });

router.get("/:id", (req: Request<{ id: string }>, res) => {
  const patient = patientService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.get("/", (_req, res: Response<Patient[]>) => {
  const data = patientService.getPatient();
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

router.post(
  "/:id/entries",
  newEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
    const addedEntry = patientService.addEntry(req.params.id, req.body);
    res.json(addedEntry);
  },
);

router.use(errorMiddleware);

export default router;
