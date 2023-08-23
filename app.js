import { askQuestion } from "./server.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Handle POST request with user input
app.post("/chat", express.urlencoded({ extended: true }), (req, res) => {
  const userInput = req.body.userInput;
  askQuestion(userInput, (response) => {
    res.render("chat", { chatInput: userInput, chatResponse: response.text });
  });
});

// Render the initial chat page
app.get("/", (req, res) => {
  res.render("chat", { chatInput: "", chatResponse: "" });
});

app.listen(port, () => {
  console.log("Server running on http://localhost:3000");
});
