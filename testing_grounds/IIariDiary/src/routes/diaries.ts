/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { type Response } from "express";

import parseNewDiaryEntry from "../util.ts";
import diaryService from "../services/diaryService.ts";
import type { NonSensitiveDiaryEntry } from "../../types.ts";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries());
});

router.post("/", (req, res) => {
  try {
    const newDiaryEntry = parseNewDiaryEntry(req.body);
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.get("/:id", (req, res) => {
  const diary = diaryService.findByID(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

export default router;
