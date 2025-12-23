package com.portfolio.taskmanager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index.html";
    }

    @GetMapping("/add-task")
    public String addTask() {
        return "add-task.html";
    }

    @GetMapping("/edit-task")
    public String editTask() {
        return "edit-task.html";
    }
}