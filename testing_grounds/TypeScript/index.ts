import express from "express";
import { calculator } from "./src/calculator.ts";

// const express = require("express");
const app = express();

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.post("/calculate", (req, res) => {
  const { value1, value2, op } = req.body;

  const result = calculator(value1, value2, op);

  return res.send({ result });
});

const PORT = 3004;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
