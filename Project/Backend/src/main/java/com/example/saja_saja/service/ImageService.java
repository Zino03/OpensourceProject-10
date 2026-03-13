package com.example.saja_saja.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
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

    private void writeCompressedJpeg(MultipartFile file, Path targetPath, float quality) throws IOException {
        BufferedImage image = ImageIO.read(file.getInputStream());
        // quality: 0.0f ~ 1.0f (0이면 개똥퀄, 1이면 원본에 가깝게)

        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
        if (!writers.hasNext()) {
            throw new IllegalStateException("No JPEG writers available");
        }
        ImageWriter writer = writers.next();

        try (OutputStream os = Files.newOutputStream(targetPath);
             ImageOutputStream ios = ImageIO.createImageOutputStream(os)) {

            writer.setOutput(ios);
            ImageWriteParam param = writer.getDefaultWriteParam();

            if (param.canWriteCompressed()) {
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(quality); // 0.0 ~ 1.0
            }

            writer.write(null, new IIOImage(image, null, null), param);
        } finally {
            writer.dispose();
        }
    }

    public String uploadImage(MultipartFile file, String subDir) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            UUID uuid = UUID.randomUUID();
            String originalName = file.getOriginalFilename();
            String ext = "";

            if (originalName != null && originalName.lastIndexOf(".") != -1) {
                ext = originalName.substring(originalName.lastIndexOf(".") + 1).toLowerCase();
            }

            String imageFileName = uuid + "_" + originalName;
            Path folderPath = Paths.get(uploadRootPath + subDir);

            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
            }

            Path imageFilePath = folderPath.resolve(imageFileName);

            // 🔥 여기서 확장자 보고 압축 저장
            if ("jpg".equals(ext) || "jpeg".equals(ext)) {
                writeCompressedJpeg(file, imageFilePath, 0.7f); // 70% 퀄리티
            } else {
                // 나머지는 그냥 저장 (png, webp 등)
                Files.write(imageFilePath, file.getBytes());
            }

            return "/uploads/" + subDir + imageFileName;

        } catch (Exception e) {
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
        }
    }


    public String uploadProfileImage(MultipartFile file) {
        return uploadImage(file, profileUploadPath);
    }

    public String uploadPostImage(MultipartFile file) {
        return uploadImage(file, postUploadPath);
    }
}
