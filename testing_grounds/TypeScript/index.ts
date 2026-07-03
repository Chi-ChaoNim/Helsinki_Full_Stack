import express from "express";
import { calculator, type Operation } from "./src/calculator.ts";

// const express = require("express");
const app = express();

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.post("/calculate", (req, res) => {
  const { value1, value2, op } = req.body;

  if (!value1 || isNaN(Number(value1))) {
    return res.status(400).send({ error: "Bad input value" });
  }

  if (!value2 || isNaN(Number(value2))) {
    return res.status(400).send({ error: "Bad input value" });
  }

  const result = calculator(Number(value1), Number(value2), op as Operation);

  return res.send({ result });
});

const PORT = 3004;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
