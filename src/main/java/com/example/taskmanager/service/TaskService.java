package com.portfolio.taskmanager.service;

import com.portfolio.taskmanager.model.Task;
import com.portfolio.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> getAllTasks() { return repository.findAll(); }
    public Task getTask(Long id) { return repository.findById(id).orElse(null); }
    public Task saveTask(Task task) { return repository.save(task); }
    public void deleteTask(Long id) { repository.deleteById(id); }
}
