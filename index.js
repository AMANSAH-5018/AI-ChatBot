const { GoogleGenerativeAI } = require("@google/generative-ai");
const env = require("dotenv");
const express = require("express");
const cors = require("cors");

env.config();
const app = express();
app.use(express.json());
app.use(cors());
const genAI = new GoogleGenerativeAI(process.env.PALM_API_KEY);
app.post("/api", async (req, res) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", //gemini-2.0-flash
  });

  const styleGuide = `
Use plain text with no unnecessary symbols or formatting.
Be direct, friendly, and solution-focused.
Avoid fluff, repetition, or generic commentary.
Prioritize clarity and speed—get to the point quickly.
`;

  const response = await model.generateContent(
    `${styleGuide}\n${req.body.query}`
  );

  // Extract text from candidates
  const output =
    response.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response received";
  //   console.log(output);
  res.json({ output: output });
});
app.get("/", (req, res) => {
  res.send("Welcome");
});
app.listen(process.env.PORT, () => {
  console.log("Sarver in running", process.env.PORT);
});
