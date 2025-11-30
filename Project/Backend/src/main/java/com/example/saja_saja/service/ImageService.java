package com.example.saja_saja.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

    @Value("${file.path.upload-root}")
    private String uploadRootPath;

    @Value("${file.path.profile-dir}")
    private String profileUploadPath;

    @Value("${file.path.post-dir}")
    private String postUploadPath;

    public String uploadImage(MultipartFile file, String subDir) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            UUID uuid = UUID.randomUUID();
            String imageFileName = uuid + "_" + file.getOriginalFilename();

            // root + subDir 경로 생성
            Path folderPath = Paths.get(uploadRootPath + subDir);

            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
            }

            Path imageFilePath = folderPath.resolve(imageFileName);
            Files.write(imageFilePath, file.getBytes());

            // URL 반환
            return "/uploads/" + subDir + imageFileName;

        } catch (Exception e) {
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다.");
        }
    }


    public String uploadProfileImage(MultipartFile file) {
        return uploadImage(file, profileUploadPath);
    }

    public String uploadPostImage(MultipartFile file) {
        return uploadImage(file, postUploadPath);
    }
}
