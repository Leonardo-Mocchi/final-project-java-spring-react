package org.lessons.java.final_project_java_spring_react.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthController {

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/unsubscribe")
    public String unsubscribe(@RequestParam(required = false) String email, Model model) {
        model.addAttribute("email", email);
        return "unsubscribe";
    }
}
