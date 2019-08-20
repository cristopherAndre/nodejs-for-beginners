const express = require("express");
const server = express();

/*
 * This is a built-in middleware function in Express.
 * It parses incoming requests with JSON payloads and is based on body-parser.
 */
server.use(express.json());
server.listen(3000);

let numberOfRequests = 0;
const projects = [];

// Function to log number of requests
function logRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Number of Requests = ${numberOfRequests}`);
  return next();
}
// Adding the function logRequests to the Global Midlleware
server.use(logRequests);

// Function to check if project exists
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project) {
    return res.status(400).json({ error: "Project not found!" });
  }
  return next();
}

// HTTP GET - Get Projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// HTTP POST - Create Project
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id: id,
    title: title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

// HTTP PUT - Edit Project - With a specific Middleware checkProjectExists
server.put("/projects/:id/", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);
  project.title = title;
  return res.json(project);
});

// HTTP DELETE - Delete Project - With a specific Middleware checkProjectExists
server.delete("/projects/:id/", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projectIndex, 1);
  return res.send();
});

// HTTP POST - Add Tasks to Project - With a specific Middleware checkProjectExists
server.post("/projects/:id/tasks/", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;
  const project = projects.find(p => p.id == id);
  project.tasks = tasks;
  return res.json(project);
});
