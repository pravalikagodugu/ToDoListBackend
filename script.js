const todoForm = document.getElementById('todo-form');
const inputTodo = document.getElementById('input-todo');
const todoContainer = document.getElementById('todo-container');
const modalBackground = document.getElementById('modal-background');
const closeModal = document.getElementById('close-modal');
const saveTodoBtn = document.getElementById('save-todo');
const modalForm = document.getElementById('modal-form');
let currentTodoId = null;

// Fetch todos when the page loads
window.onload = function() {
  fetchTodos();
};

// Fetch Todos from the backend
function fetchTodos() {
  fetch('http://localhost:3000/todos')
    .then(response => response.json())
    .then(data => {
      displayTodos(data.todos);
    });
}

// Display Todos
function displayTodos(todos) {
  todoContainer.innerHTML = '';
  todos.forEach(todo => {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo');
    todoElement.innerHTML = `
      <div class="todo-info">
        <span class="${todo.completed ? 'completed' : ''}">${todo.desc}</span>
      </div>
      <div class="todo-btn">
        <button class="todo-edit" onclick="editTodo('${todo._id}')">Edit</button>
        <button class="todo-delete" onclick="deleteTodo('${todo._id}')">Delete</button>
      </div>
    `;
    todoContainer.appendChild(todoElement);
  });
}

// Add Todo
todoForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const todoDesc = inputTodo.value;
  fetch('http://localhost:3000/todos', {
    method: 'POST',
    body: JSON.stringify({ desc: todoDesc, completed: false }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
    .then(data => {
      fetchTodos();
      inputTodo.value = '';
    });
});

// Edit Todo
function editTodo(todoId) {
  currentTodoId = todoId;
  fetch(`http://localhost:3000/todos/${todoId}`)
    .then(response => response.json())
    .then(todo => {
      document.getElementById('edit-todo-name').value = todo.desc;
      document.getElementById('edit-todo-completed').checked = todo.completed;
      modalBackground.style.display = 'flex';
    });
}

// Close Modal
closeModal.addEventListener('click', function() {
  modalBackground.style.display = 'none';
});

// Save Todo
saveTodoBtn.addEventListener('click', function() {
  const updatedDesc = document.getElementById('edit-todo-name').value;
  const updatedCompleted = document.getElementById('edit-todo-completed').checked;

  fetch(`http://localhost:3000/todos/${currentTodoId}`, {
    method: 'PUT',
    body: JSON.stringify({ desc: updatedDesc, completed: updatedCompleted }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
    .then(data => {
      fetchTodos();
      modalBackground.style.display = 'none';
    });
});

// Delete Todo
function deleteTodo(todoId) {
  fetch(`http://localhost:3000/todos/${todoId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(() => {
      fetchTodos();
    });
}
