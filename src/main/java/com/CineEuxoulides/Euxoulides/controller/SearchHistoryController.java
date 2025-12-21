package com.CineEuxoulides.Euxoulides.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:5174")
public class SearchHistoryController {

    private List<String> history = new ArrayList<>();

    @GetMapping("/history")
    public ResponseEntity<List<String>> getHistory() {
        return ResponseEntity.ok(history);
    }

    @PostMapping("/history")
    public ResponseEntity<String> saveSearch(@RequestBody SearchRequest request) {
        String term = request.getQuery();
        if (term != null && !term.trim().isEmpty() && !history.contains(term)) {
            history.add(0, term);
            if (history.size() > 5) history.remove(5);
        }
        return ResponseEntity.ok("Saved");
    }
}

class SearchRequest {
    private String query;
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}