const http = require('http');
const url = require('url');
const fs = require('fs'); // Import the File System module
const taskController = require('./tasks');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (method === 'GET') {
    if (path === '/') {
      fs.readFile('./index.html', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading index.html');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else if (path === '/script.js') {
      fs.readFile('./script.js', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading script.js');
        } else {
          res.writeHead(200, { 'Content-Type': 'application/javascript' });
          res.end(data);
        }
      });
    } else if (path === '/style.css') {
      fs.readFile('./style.css', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading style.css');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/css' });
          res.end(data);
        }
      });
    } else if (path === '/tasks') {
      taskController.AllTasks((err, tasks) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to retrieve tasks' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(tasks));
        }
      });
    } else if (path.startsWith('/tasks/')) {
      const taskId = path.split('/')[2];
      taskController.getTask(taskId, (err, task) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Task not found' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(task));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } 
  else if (method === 'POST') {
    console.log(`Received request: ${method} ${path}`);
    if (path === '/tasks') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const task = JSON.parse(body);
            taskController.createTask(task, (err, newTask) => { // Ensure `newTask` is distinct
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Failed to create task" }));
                } else {
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(newTask)); // Return the newly created task
                }
            });
        });
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
    }
}

  else if (method === 'PUT') {
    if (path.startsWith('/tasks/')) {
      const taskId = path.split('/')[2];
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        const task = JSON.parse(body);
        taskController.update(taskId, task, (err, task) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to update task' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(task));
          }
        });
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } else if (method === 'DELETE') {
    if (path.startsWith('/tasks/')) {
      const taskId = path.split('/')[2];
      taskController.deleted(taskId, (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to delete task' }));
        } else {
          res.writeHead(204);
          res.end();
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
