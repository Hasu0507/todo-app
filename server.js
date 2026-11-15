// Backend: Node.js + Express REST API. Data is saved in todos.json.
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "todos.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Read / write helpers (the "database")
function readTodos() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8") || "[]");
}
function writeTodos(todos) {
  fs.writeFileSync(DB_FILE, JSON.stringify(todos, null, 2));
}

// READ all tasks
app.get("/api/todos", (req, res) => res.json(readTodos()));

// CREATE a task
app.post("/api/todos", (req, res) => {
  const title = (req.body.title || "").trim();
  if (!title) return res.status(400).json({ error: "Title is required" });
  const todos = readTodos();
  const todo = { id: Date.now(), title, done: false };
  todos.push(todo);
  writeTodos(todos);
  res.status(201).json(todo);
});

// UPDATE a task (edit title or mark done)
app.put("/api/todos/:id", (req, res) => {
  const todos = readTodos();
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Task not found" });
  if (typeof req.body.title === "string" && req.body.title.trim()) todo.title = req.body.title.trim();
  if (typeof req.body.done === "boolean") todo.done = req.body.done;
  writeTodos(todos);
  res.json(todo);
});

// DELETE a task
app.delete("/api/todos/:id", (req, res) => {
  const todos = readTodos().filter((t) => t.id !== Number(req.params.id));
  writeTodos(todos);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`To-Do app running at http://localhost:${PORT}`));
