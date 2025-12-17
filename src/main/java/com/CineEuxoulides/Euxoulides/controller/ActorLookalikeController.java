package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.service.ActorLookalikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/lookalike")
@CrossOrigin(origins = "http://localhost:5173") // Επιτρέπουμε στο React να μιλάει με το Backend
public class ActorLookalikeController {

    @Autowired
    private ActorLookalikeService actorLookalikeService;

    @PostMapping("/analyze")
    public Map<String, String> analyzeImage(@RequestParam("file") MultipartFile file) {
        return actorLookalikeService.analyzeImage(file);
    }
}