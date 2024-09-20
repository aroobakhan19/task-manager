document.getElementById('TaskForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const taskInput = document.getElementById('taskInput');
    const taskValue = taskInput.value.trim();

    if (taskValue) {
        addTask(taskValue);
        taskInput.value = ''; // Clear input
    }
});

function addTask(task) {
    const taskList = document.getElementById('taskList');

    // Create a new list item for the task
    const li = document.createElement('li');
    li.textContent = task;

    // Edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-button';
    editButton.onclick = function() {
        editTask(task, li);
    };

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = function() {
        deleteTask(li);
    };

    // Append buttons to the list item
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    
    // Add the list item to the task list
    taskList.appendChild(li);

    // Send the task to the server
    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
    })
    .then(response => response.json())
    .then(data => {
        // Optionally, handle the server's response
        console.log('Task added:', data);
    })
    .catch(error => {
        console.error('Error adding task:', error);
    });
}

function editTask(task, li) {
    const newTask = prompt('Edit your task:', task);
    if (newTask !== null && newTask.trim() !== '') {
        li.firstChild.nodeValue = newTask; // Update the list item text

        // Optionally, update the task on the server as well
    }
}

function deleteTask(li) {
    const taskList = document.getElementById('taskList');
    taskList.removeChild(li); // Remove the task from the UI

    // Optionally, send a delete request to the server here
}

// Fetch tasks on page load
function fetchTasks() {
    fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.task; // Adjust this based on your task object structure
                taskList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

// Call fetchTasks to load tasks on page load
fetchTasks();
