// Frontend: talks to the Express API using fetch()
const list = document.getElementById("list");
const input = document.getElementById("newTask");
const addBtn = document.getElementById("addBtn");
const countEl = document.getElementById("count");
let todos = [];
let filter = "all";

async function loadTodos() {
  const res = await fetch("/api/todos");
  todos = await res.json();
  render();
}

function render() {
  const left = todos.filter((t) => !t.done).length;
  countEl.textContent = `${left} of ${todos.length} tasks left`;

  const shown = todos.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );

  list.innerHTML = "";
  if (shown.length === 0) {
    list.innerHTML = '<p class="empty">No tasks here. Add one above.</p>';
    return;
  }

  shown.forEach((t) => {
    const li = document.createElement("li");
    if (t.done) li.classList.add("done");

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = t.done;
    box.onchange = () => updateTodo(t.id, { done: box.checked });

    const text = document.createElement("span");
    text.textContent = t.title; // textContent keeps it safe from HTML injection

    const edit = document.createElement("button");
    edit.className = "small";
    edit.textContent = "Edit";
    edit.onclick = () => {
      const title = prompt("Edit task:", t.title);
      if (title && title.trim()) updateTodo(t.id, { title });
    };

    const del = document.createElement("button");
    del.className = "small delete";
    del.textContent = "Delete";
    del.onclick = () => deleteTodo(t.id);

    li.append(box, text, edit, del);
    list.appendChild(li);
  });
}

async function addTodo() {
  const title = input.value.trim();
  if (!title) return;
  await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  input.value = "";
  loadTodos();
}

async function updateTodo(id, data) {
  await fetch(`/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: "DELETE" });
  loadTodos();
}

addBtn.onclick = addTodo;
input.addEventListener("keydown", (e) => { if (e.key === "Enter") addTodo(); });

document.querySelectorAll(".filter").forEach((btn) => {
  btn.onclick = () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  };
});

loadTodos();
