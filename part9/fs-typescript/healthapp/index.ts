import express from "express";
import { BMICalculator } from "./bmiCalculator.ts";
import { ExerciseCalculator } from "./exerciseCalculator.ts";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req: express.Request, res: express.Response) => {
  if (
    !Object.hasOwn(req.query, "height") ||
    !Object.hasOwn(req.query, "weight")
  ) {
    res.status(400).send({ error: "malformatted parameters" });
  }

  if (!isNaN(Number(req.query.height)) && !isNaN(Number(req.query.weight))) {
    const height: number = Number(req.query.height);
    const weight: number = Number(req.query.weight);

    const result = BMICalculator(height, weight);

    return res.send({ weight, height, bmi: result });
  }
  return res.status(400).send({ error: "malformatted parameters" });
});

app.post("/exercises", (req: express.Request, res: express.Response) => {
  if (!req.body && !(typeof req.body === "object")) {
    return res.status(400).send({ Error: "No data sent" });
  }

  const { daily_exercises, target } = req.body as {
    daily_exercises?: unknown;
    target?: unknown;
  };

  if (!daily_exercises || !target) {
    return res.status(400).send({ error: "parameters missing" });
  }

  if (
    !isNaN(Number(target)) &&
    Array.isArray(daily_exercises) &&
    daily_exercises.every((value) => !isNaN(Number(value)))
  ) {
    const result = ExerciseCalculator(
      daily_exercises as number[],
      Number(target),
    );
    return res.status(200).send(result);
  }
  return res.status(400).send({ error: "malformatted parameters" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
