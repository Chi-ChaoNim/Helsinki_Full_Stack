import express from "express";
import cors from "cors";
import diagnosisRouter from "./routes/diagnosis.ts";
import patientRouter from "./routes/patient.ts";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  return res.send("pong");
});

app.use("/api/patients", patientRouter);

app.use("/api/diagnosis", diagnosisRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
