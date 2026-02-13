package com.dipika.kalakriti2.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.dipika.kalakriti2.utils.UploadToCloud;

@RestController
@RequestMapping("/image")
@CrossOrigin(origins = "http://localhost:5173")
public class ImageController {

    private final UploadToCloud uploadToCloud;

    public ImageController(UploadToCloud uploadToCloud) {
        this.uploadToCloud = uploadToCloud;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) {
        String imageUrl = uploadToCloud.uploadToCloud(file);
        return ResponseEntity.ok(imageUrl);
    }
}
