const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const mongoose = require('mongoose');


const app = express();
const port = 3000;

app.use(custom_middleware);

function custom_middleware(req, res, next) {
  console.log("from middleware");
  next();
}

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://godugupravalika:Pravali7%40@todocluster.m0xkd.mongodb.net/?retryWrites=true&w=majority&appName=ToDoCluster")

  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

const todos = [
  { id: 1, desc: "Write Python", completed: false },
  { id: 2, desc: "Write JavaScript", completed: true },
  { id: 3, desc: "Write SQL", completed: false },
];

// Home Route
app.get("/", (req, res) => {
  res.send("<h1>Todo List API Home Page</h1>");
});

// Get All Todos
app.get("/todos", (req, res) => {
// Returning the todos as JSON
    res.json({
      message: "List of Todos",
      todos: todos,
    });
});

// Get a Single Todo
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((todo) => todo.id == req.params.id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).send("Todo not found");
  }
});

// Add a New Todo
app.post("/todos", (req, res) => {
  const { desc, completed } = req.body;
  if (desc === undefined || completed === undefined) {
    return res.status(400).send("Invalid request body");
  }
  const newTodo = { id: uuidv4(), desc, completed };
  todos.push(newTodo);
  res.json(todos);
});

// Update a Todo
app.put("/todos/:id", (req, res) => {
  const todo = todos.find((todo) => todo.id == req.params.id);
  if (todo) {
    todo.desc = req.body.desc;
    todo.completed = req.body.completed;
    return res.json(todos); // Return here to prevent further execution
  }
  else {
    return res.status(404).send("Todo with that ID doesn't exist");
  }
    
});

// Delete a Todo
app.delete("/todos/:id", (req, res) => {
  const index = todos.findIndex((todo) => todo.id == req.params.id);
  if (index !== -1) {
    todos.splice(index, 1);
    return res.json(todos); // Return to prevent further code execution
  } else {
    return res.status(404).send("Todo not found");
  }
});

// Error handling middleware for unmatched routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  
  // Start the server
  app.listen(port, () => {
    console.log("App is working/listening on port:", port);
});
