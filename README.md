# To-Do List (Full Stack)

A simple full stack app: HTML/CSS/JavaScript frontend, Node.js + Express backend, JSON file storage.

## Run it
1. Install Node.js (https://nodejs.org)
2. In this folder run:
   npm install
   npm start
3. Open http://localhost:3000

## Features
Add, edit, delete, mark done, filter (All / Active / Done). Tasks are saved in todos.json.

## API
GET    /api/todos        list tasks
POST   /api/todos        add a task        { "title": "..." }
PUT    /api/todos/:id    edit / mark done  { "title": "...", "done": true }
DELETE /api/todos/:id    delete a task

## Structure
server.js          backend + REST API
public/index.html  page
public/style.css   styling
public/script.js   frontend logic (fetch calls)
