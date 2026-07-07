import axios from "axios";

import {
  type NewDiaryEntry,
  type NonSensitiveDiaryEntry,
} from "../../../backend/src/types.ts";

const baseURL = "http://localhost:3000/api/diaries";

const getAll = () =>
  axios
    .get<NonSensitiveDiaryEntry[]>(baseURL)
    .then((response) => response.data);

const create = (object: NewDiaryEntry) =>
  axios
    .post<NonSensitiveDiaryEntry>(baseURL, object)
    .then((response) => response.data);

export default { getAll, create };
