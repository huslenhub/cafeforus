package org.example.cafeforus.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.URLDecoder;

@RestController
public class FileController {

    // 이미지를 제공하는 엔드포인트

    @GetMapping("/uploads/{fileName:.+}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String fileName) {
        try {


            // 업로드 폴더의 경로 (자신의 실제 경로로 설정)
            String uploadDir = "/Users/imac24/Desktop/cafeforus/cafeForUs_back/cafeForUs/uploads/";
            String decodedFileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8);
            System.out.println("✅ 디코딩된 파일 이름: " + decodedFileName);  // 로그 찍기
            Path filePath = Paths.get(uploadDir, decodedFileName);
            System.out.println("✅ 전체 파일 경로: " + filePath);  // 경로 출력
            File file = filePath.toFile();
            System.out.println("✅ 파일 존재 여부: " + file.exists());

            if (file.exists() && file.isFile()) {
                System.out.println("✅ 파일 제공 중: " + file.getAbsolutePath()); // ✅ 여기에 로그 추가


                FileSystemResource resource = new FileSystemResource(file);

                String mimeType = Files.probeContentType(filePath); // 자동 MIME 감지
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, mimeType != null ? mimeType : "application/octet-stream")
                        .body(resource);
            } else {
                System.out.println("😂 파일 제공 실패 "); // ✅ 여기에 로그 추가

                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
