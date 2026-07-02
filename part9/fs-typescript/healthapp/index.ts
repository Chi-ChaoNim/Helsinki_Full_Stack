import express from "express";
import { BMICalculator } from "./bmiCalculator.ts";

const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  if (
    !Object.hasOwn(req.query, "height") ||
    !Object.hasOwn(req.query, "weight")
  ) {
    res.send({ error: "malformatted parameters" });
  }
  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);

  const result = BMICalculator(height, weight);

  return res.send({ weight, height, bmi: result });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
