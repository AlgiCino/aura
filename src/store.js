import { createProject, createPhase, createTask } from './utils/entities.js';

// Simple in-memory store for demo purposes
class DataStore {
  constructor() {
    this.projects = [];
    this.phases = [];
    this.tasks = [];
    this.listeners = new Set();
    this.loadSampleData();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }

  // Projects
  addProject(projectData) {
    const project = createProject(projectData);
    this.projects.push(project);
    this.notify();
    return project;
  }

  updateProject(id, updates) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates };
      this.notify();
    }
  }

  deleteProject(id) {
    // First get all phases that belong to this project
    const phaseIdsToDelete = this.phases
      .filter(ph => ph.project_id === id)
      .map(ph => ph.id);
    
    // Remove tasks that belong to phases of this project
    this.tasks = this.tasks.filter(t => !phaseIdsToDelete.includes(t.phase_id));
    
    // Remove phases that belong to this project
    this.phases = this.phases.filter(ph => ph.project_id !== id);
    
    // Finally remove the project itself
    this.projects = this.projects.filter(p => p.id !== id);
    
    this.notify();
  }

  getProjects() {
    return this.projects;
  }

  getProject(id) {
    return this.projects.find(p => p.id === id);
  }

  // Phases
  addPhase(phaseData) {
    const phase = createPhase(phaseData);
    this.phases.push(phase);
    this.notify();
    return phase;
  }

  updatePhase(id, updates) {
    const index = this.phases.findIndex(p => p.id === id);
    if (index !== -1) {
      this.phases[index] = { ...this.phases[index], ...updates };
      this.notify();
    }
  }

  deletePhase(id) {
    this.phases = this.phases.filter(p => p.id !== id);
    this.tasks = this.tasks.filter(t => t.phase_id !== id);
    this.notify();
  }

  getPhases() {
    return this.phases;
  }

  getPhasesByProject(projectId) {
    return this.phases.filter(p => p.project_id === projectId);
  }

  getPhase(id) {
    return this.phases.find(p => p.id === id);
  }

  // Tasks
  addTask(taskData) {
    const task = createTask(taskData);
    this.tasks.push(task);
    this.notify();
    return task;
  }

  updateTask(id, updates) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...updates };
      this.notify();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.notify();
  }

  getTasks() {
    return this.tasks;
  }

  getTasksByPhase(phaseId) {
    return this.tasks.filter(t => t.phase_id === phaseId);
  }

  getTask(id) {
    return this.tasks.find(t => t.id === id);
  }

  // Load sample data
  loadSampleData() {
    // Create sample projects
    const project1 = this.addProject({
      name: "E-commerce Platform",
      description: "Build a modern e-commerce platform with React and Node.js",
      vision: "Create the most user-friendly online shopping experience",
      goal: "Launch MVP within 6 months",
      status: "in_progress",
      priority: "high",
      start_date: "2024-01-15",
      end_date: "2024-07-15",
      tech_stack: ["React", "Node.js", "PostgreSQL", "Redis"],
      budget: 150000
    });

    const project2 = this.addProject({
      name: "Mobile App",
      description: "Cross-platform mobile application for task management",
      vision: "Simplify task management for teams",
      goal: "Release beta version in 3 months",
      status: "planning",
      priority: "medium",
      start_date: "2024-03-01",
      end_date: "2024-12-01",
      tech_stack: ["React Native", "Firebase", "Redux"],
      budget: 80000
    });

    // Create sample phases
    const phase1 = this.addPhase({
      project_id: project1.id,
      name: "Foundation Setup",
      description: "Set up project infrastructure and core architecture",
      phase_number: 1,
      duration_weeks: 4,
      status: "completed",
      start_date: "2024-01-15",
      end_date: "2024-02-12",
      deliverables: ["Project setup", "Database design", "API structure"]
    });

    const phase2 = this.addPhase({
      project_id: project1.id,
      name: "Core Development",
      description: "Develop main features and functionality",
      phase_number: 2,
      duration_weeks: 8,
      status: "in_progress",
      start_date: "2024-02-13",
      end_date: "2024-04-08",
      deliverables: ["User authentication", "Product catalog", "Shopping cart"]
    });

    this.addPhase({
      project_id: project2.id,
      name: "Research & Planning",
      description: "Market research and technical planning",
      phase_number: 1,
      duration_weeks: 2,
      status: "completed",
      start_date: "2024-03-01",
      end_date: "2024-03-15",
      deliverables: ["Market analysis", "Technical specifications", "UI mockups"]
    });

    // Create sample tasks
    this.addTask({
      phase_id: phase1.id,
      title: "Set up development environment",
      description: "Configure development tools and environment",
      category: "backend",
      status: "completed",
      priority: "high",
      estimated_hours: 8,
      actual_hours: 6,
      due_date: "2024-01-18",
      tags: ["setup", "environment"]
    });

    this.addTask({
      phase_id: phase2.id,
      title: "Implement user authentication",
      description: "Build secure user login and registration system",
      category: "backend",
      status: "in_progress",
      priority: "high",
      estimated_hours: 20,
      actual_hours: 12,
      due_date: "2024-02-20",
      tags: ["auth", "security"]
    });

    this.addTask({
      phase_id: phase2.id,
      title: "Design product catalog UI",
      description: "Create responsive product listing and detail pages",
      category: "frontend",
      status: "todo",
      priority: "medium",
      estimated_hours: 16,
      due_date: "2024-03-01",
      tags: ["ui", "catalog", "responsive"]
    });
  }
}

export const store = new DataStore();
