
/**
 * Input field where the user enters a new task.
 * @type {HTMLInputElement}
 */
const taskInput = document.getElementById("task-input");

/**
 * Button to add a new task.
 * @type {HTMLButtonElement}
 */
const addTaskBtn = document.getElementById("add-task-btn");

/**
 * List element where tasks are displayed.
 * @type {HTMLUListElement}
 */
const taskList = document.getElementById("task-list");

/**
 * Loads tasks from localStorage and renders them when the page is loaded.
 */
window.onload = () => {
  try {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const transformedTasks = storedTasks.map((task) => ({
      ...task,
      text: task.text.toUpperCase(),
    }));
    renderTasksRecursively(transformedTasks); // Using recursion to render tasks
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
};

/**
 * Renders a list of tasks recursively.
 * @param {Array<Object>} tasks - Array of task objects to render.
 * @param {number} [index=0] - Current index of the task being processed.
 */
function renderTasksRecursively(tasks, index = 0) {
  if (index >= tasks.length) return;
  renderTask(tasks[index]);
  renderTasksRecursively(tasks, index + 1); // Recursive call
}

/**
 * Adds a new task to the list and localStorage when the button is clicked.
 */
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText.toUpperCase(),
    completed: false,
  };

  try {
    renderTask(task);
    saveTaskToLocalStorage(task);
    taskInput.value = "";
  } catch (error) {
    console.error("Error adding task:", error);
  }
});

/**
 * Renders a single task as a list item (li) with buttons for complete/undo and delete actions.
 * @param {Object} task - Task object to render.
 * @param {number} task.id - Unique ID of the task.
 * @param {string} task.text - Text description of the task.
 * @param {boolean} task.completed - Completion status of the task.
 */
function renderTask(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.classList.add(task.completed ? "completed" : null);

  li.innerHTML = `
        <span>${task.text}</span>
        <div class="task-buttons">
            <button class="complete">${
              task.completed ? "Undo" : "Complete"
            }</button>
            <button class="delete">Delete</button>
        </div>
    `;

  li.querySelector(".complete").addEventListener("click", () => {
    task.completed = !task.completed;
    updateTaskInLocalStorage(task);
    li.classList.toggle("completed");
    li.querySelector(".complete").textContent = task.completed
      ? "Undo"
      : "Complete";
  });

  li.querySelector(".delete").addEventListener("click", () => {
    li.remove();
    deleteTaskFromLocalStorage(task.id);
  });

  taskList.appendChild(li);
}

/**
 * Saves a task to localStorage.
 * @param {Object} task - Task object to save.
 */
function saveTaskToLocalStorage(task) {
  try {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    throw new Error("Failed to save task to localStorage");
  }
}

/**
 * Updates a task in localStorage.
 * @param {Object} updatedTask - Updated task object.
 */
function updateTaskInLocalStorage(updatedTask) {
  try {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = _.findIndex(tasks, { id: updatedTask.id }); // Lodash to find the task
    if (taskIndex > -1) {
      tasks[taskIndex] = updatedTask;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  } catch (error) {
    throw new Error("Failed to update task in localStorage");
  }
}

/**
 * Deletes a task from localStorage.
 * @param {number} taskId - ID of the task to delete.
 */
function deleteTaskFromLocalStorage(taskId) {
  try {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = _.filter(tasks, (task) => task.id !== taskId); // Lodash filter method
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  } catch (error) {
    throw new Error("Failed to delete task from localStorage");
  }
}
