const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://godugupravalika:Pravali7%40@todocluster.m0xkd.mongodb.net/?retryWrites=true&w=majority&appName=ToDoCluster")
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define Todo Schema
const todoSchema = new mongoose.Schema({
  desc: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("<h1>Todo List API Home Page</h1>");
});

// Get All Todos
app.get("/todos", (req, res) => {
  Todo.find()
    .then((todos) => {
      res.json({
        message: "List of Todos",
        todos: todos,
      });
    })
    .catch((err) => res.status(500).send(err));
});

// Get a Single Todo
app.get("/todos/:id", (req, res) => {
  Todo.findById(req.params.id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send("Todo not found");
      }
      res.json(todo);
    })
    .catch((err) => res.status(500).send(err));
});

// Add a New Todo
app.post("/todos", (req, res) => {
  const { desc, completed } = req.body;
  const newTodo = new Todo({
    desc,
    completed: completed || false,
  });

  newTodo.save()
    .then((todo) => {
      res.status(201).json(todo);
    })
    .catch((err) => res.status(500).send(err));
});

// Update a Todo
app.put("/todos/:id", (req, res) => {
  const { desc, completed } = req.body;
  Todo.findByIdAndUpdate(req.params.id, { desc, completed }, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).send("Todo not found");
      }
      res.json(updatedTodo);
    })
    .catch((err) => res.status(500).send(err));
});

// Delete a Todo
app.delete("/todos/:id", (req, res) => {
  Todo.findByIdAndDelete(req.params.id)
    .then((deletedTodo) => {
      if (!deletedTodo) {
        return res.status(404).send("Todo not found");
      }
      res.json(deletedTodo);
    })
    .catch((err) => res.status(500).send(err));
});

// Start the server
app.listen(port, () => {
  console.log("App is working/listening on port:", port);
});
