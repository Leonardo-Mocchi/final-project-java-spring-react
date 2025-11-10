package org.lessons.java.final_project_java_spring_react.controller.api;

import org.lessons.java.final_project_java_spring_react.model.Platform;
import org.lessons.java.final_project_java_spring_react.service.PlatformService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/platforms")
@CrossOrigin
public class PlatformRestController {

    @Autowired
    private PlatformService platformService;

    //> INDEX
    @GetMapping
    public List<Platform> index() {
        return platformService.findAll();
    }

    //> SHOW
    @GetMapping("/{id}")
    public ResponseEntity<Platform> show(@PathVariable Long id) {
        Optional<Platform> platformAttempt = platformService.findById(id);

        if (platformAttempt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(platformAttempt.get(), HttpStatus.OK);
    }
}
