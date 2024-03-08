package com.pixshare.pixshareapi.util;

import com.pixshare.pixshareapi.exception.RequestValidationException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@Service
public class ImageUtil {

    public byte[] getImageBytesFromMultipartFile(MultipartFile imageFile) throws RequestValidationException {

        byte[] imageBytes;

        // Check if the file is an image
        if (!Objects.requireNonNull(imageFile.getContentType()).startsWith("image")) {
            throw new RequestValidationException("File is not an image");
        }

        // Check if the image file can be read
        try {
            imageBytes = imageFile.getBytes();
        } catch (IOException e) {
            System.out.println(e.getMessage());
            throw new RequestValidationException("File does not exist or could not be read");
        }

        return imageBytes;
    }

}
