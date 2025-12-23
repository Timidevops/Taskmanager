package com.portfolio.taskmanager.controller;

import com.portfolio.taskmanager.model.Task;
import com.portfolio.taskmanager.service.TaskService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;
    public TaskController(TaskService service) { this.service = service; }

    @GetMapping
    public List<Task> getTasks() { return service.getAllTasks(); }

    @GetMapping("/{id}")
    public Task getTask(@PathVariable Long id) { return service.getTask(id); }

    @PostMapping
    public Task createTask(@RequestBody Task task) { return service.saveTask(task); }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        Task existing = service.getTask(id);
        if (existing != null) {
            existing.setTitle(task.getTitle());
            existing.setDescription(task.getDescription());
            existing.setCompleted(task.isCompleted());
            return service.saveTask(existing);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) { service.deleteTask(id); }
}
