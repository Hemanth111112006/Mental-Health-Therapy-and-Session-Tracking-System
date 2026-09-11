package com.testing;

import com.testing.utils.ConfigReader;

/**
 * Main entry point for the SoftwareTesting automation suite.
 */
public class Main {

    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("  MindCare EHR — Software Testing Automation Suite");
        System.out.println("=================================================");
        System.out.println("Target Web App URL: " + ConfigReader.getProperty("app.base.url", "http://localhost:5173"));
        System.out.println("Target Backend API: " + ConfigReader.getProperty("api.base.url", "http://localhost:8080/api"));
        System.out.println("Default Browser:    " + ConfigReader.getProperty("browser", "chrome"));
        System.out.println("Headless Mode:      " + ConfigReader.getBooleanProperty("headless", false));
        System.out.println("=================================================");
        System.out.println("To execute tests in IntelliJ IDEA:");
        System.out.println("  1. Right-click 'src/test/resources/testng.xml' -> Run");
        System.out.println("  2. Or right-click any test class in 'src/test/java' -> Run");
        System.out.println("=================================================");
    }
}
