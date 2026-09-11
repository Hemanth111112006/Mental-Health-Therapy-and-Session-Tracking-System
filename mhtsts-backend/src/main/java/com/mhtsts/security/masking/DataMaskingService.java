package com.mhtsts.security.masking;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Profile("!prod")
public class DataMaskingService {

    private static final Logger logger = LoggerFactory.getLogger(DataMaskingService.class);

    public String maskName(String name) {
        if (name == null || name.length() < 2) return name;
        String[] parts = name.split(" ");
        StringBuilder masked = new StringBuilder();
        for (String part : parts) {
            if (part.length() > 0) {
                masked.append(part.charAt(0));
                masked.append("*".repeat(part.length() - 1));
                masked.append(" ");
            }
        }
        return masked.toString().trim();
    }

    public String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return phone;
        return "*".repeat(phone.length() - 4) + phone.substring(phone.length() - 4);
    }

    public String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        String[] parts = email.split("@");
        String namePart = parts[0];
        if (namePart.length() > 2) {
            namePart = namePart.charAt(0) + "*".repeat(namePart.length() - 2) + namePart.charAt(namePart.length() - 1);
        }
        return namePart + "@" + parts[1];
    }
}
