package org.example.cafeforus.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {


    @Value("${file.upload-dir}")
    private String uploadDir;

    // 파일을 저장하고 저장된 경로를 반환하는 메서드
    public String saveFile(MultipartFile file) throws IOException {
        // UUID로 파일 이름을 생성하여 중복을 방지
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir, fileName);

        // 파일 저장할 디렉토리 생성
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 파일 저장
        Files.write(path, file.getBytes());

        return fileName;  // 저장된 파일 이름 반환 (파일 경로도 반환할 수 있음)
    }

    // 파일 경로 반환
    public String getFilePath(String fileName) {
        return Paths.get(uploadDir, fileName).toString();
    }

    // 파일 삭제 기능
    public boolean deleteFile(String fileName) {
        Path filePath = Paths.get(uploadDir, fileName);
        try {
            Files.deleteIfExists(filePath);  // 파일이 존재하면 삭제
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}