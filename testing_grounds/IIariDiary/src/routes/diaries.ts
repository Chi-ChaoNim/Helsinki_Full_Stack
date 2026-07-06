/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { type Response, type Request } from "express";

import diaryService from "../services/diaryService.ts";
import {
  type DiaryEntry,
  type NewDiaryEntry,
  type NonSensitiveDiaryEntry,
} from "../../types.ts";
import { newDiaryParser } from "../middleware/newDiaryParser.ts";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries());
});

router.get("/:id", (req, res) => {
  const diary = diaryService.findByID(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

router.post(
  "/",
  newDiaryParser,
  (
    req: Request<unknown, unknown, NewDiaryEntry>,
    res: Response<DiaryEntry>,
  ) => {
    const addedEntry = diaryService.addDiary(req.body);
    res.json(addedEntry);
  },
);

export default router;
