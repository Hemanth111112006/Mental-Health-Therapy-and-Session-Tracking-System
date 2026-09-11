package com.testing.selenium;

import com.testing.utils.ConfigReader;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.time.Duration;

/**
 * Selenium WebDriver UI Automation Test Suite.
 * Automates testing of MindCare EHR / web portal login flow.
 */
public class LoginAutomationTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private String baseUrl;

    @BeforeClass
    public void setUp() {
        baseUrl = ConfigReader.getProperty("app.base.url", "http://localhost:5173");
        boolean isHeadless = ConfigReader.getBooleanProperty("headless", false);

        // Automatically setup the appropriate ChromeDriver matching installed Chrome
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        if (isHeadless) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--start-maximized");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--remote-allow-origins=*");

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(ConfigReader.getIntProperty("implicit.wait.seconds", 10)));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @Test(priority = 1, description = "Verify web application login page loads successfully")
    public void testLoginPageLoads() {
        driver.get(baseUrl + "/login");
        String pageTitle = driver.getTitle();
        System.out.println("Loaded Page Title: " + pageTitle);
        Assert.assertNotNull(pageTitle, "Page title should not be null");
    }

    @Test(priority = 2, description = "Verify presence of essential login elements")
    public void testLoginFormElementsPresent() {
        driver.get(baseUrl + "/login");

        // Verify username/email input is present
        WebElement usernameInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector("input[type='email'], input[type='text'], input[placeholder*='email' i]")
        ));
        Assert.assertTrue(usernameInput.isDisplayed(), "Username / Email input field must be displayed");

        // Verify password input is present
        WebElement passwordInput = driver.findElement(
            By.cssSelector("input[type='password']")
        );
        Assert.assertTrue(passwordInput.isDisplayed(), "Password input field must be displayed");

        // Verify submit/login button is present
        WebElement loginButton = driver.findElement(By.cssSelector("button[type='submit'], .mc-luxury-btn-submit, .mc-btn-primary"));
        Assert.assertTrue(loginButton.isDisplayed(), "Login submit button must be displayed");
    }

    @Test(priority = 3, description = "Verify negative login validation with invalid credentials")
    public void testInvalidLoginRejection() {
        driver.get(baseUrl + "/login");

        WebElement usernameInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector("input[type='email'], input[type='text'], input[placeholder*='email' i]")
        ));
        WebElement passwordInput = driver.findElement(By.cssSelector("input[type='password']"));
        WebElement loginButton = driver.findElement(By.cssSelector("button[type='submit'], .mc-luxury-btn-submit, .mc-btn-primary"));

        usernameInput.clear();
        usernameInput.sendKeys("invalid_user@mindcare.com");
        passwordInput.clear();
        passwordInput.sendKeys("wrong_password_123");
        loginButton.click();

        // Give a moment for feedback to appear
        try {
            Thread.sleep(1000);
        } catch (InterruptedException ignored) {}

        // User should remain on login page or see an error message
        Assert.assertTrue(driver.getCurrentUrl().contains("login"), "User must not be granted access with invalid credentials");
    }

    @Test(priority = 4, description = "Verify successful end-to-end login flow landing on Dashboard end page")
    public void testSuccessfulLoginAndLandingOnDashboard() {
        driver.get(baseUrl + "/login");

        WebElement usernameInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector("input[type='email'], input[type='text'], input[placeholder*='email' i]")
        ));
        WebElement passwordInput = driver.findElement(By.cssSelector("input[type='password']"));
        WebElement loginButton = driver.findElement(By.cssSelector("button[type='submit'], .mc-luxury-btn-submit, .mc-btn-primary"));

        // Enter valid admin credentials
        usernameInput.clear();
        usernameInput.sendKeys(ConfigReader.getProperty("admin.username", "admin@mindcare.com"));
        passwordInput.clear();
        passwordInput.sendKeys(ConfigReader.getProperty("admin.password", "admin123"));
        loginButton.click();

        // Wait for redirection to dashboard end page
        boolean redirected = wait.until(ExpectedConditions.urlContains("/dashboard"));
        Assert.assertTrue(redirected, "User should be redirected to /dashboard on successful authentication");

        // Verify landing on the successful dashboard end page
        String currentUrl = driver.getCurrentUrl();
        System.out.println(">>> SUCCESSFUL END PAGE REACHED: " + currentUrl);
        Assert.assertTrue(currentUrl.contains("/dashboard"), "Must land on the Dashboard end page");

        // Verify dashboard header or main container is loaded
        WebElement dashboardContainer = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector(".mc-page-container, .mc-page-title, main, [class*='dashboard' i]")
        ));
        Assert.assertTrue(dashboardContainer.isDisplayed(), "Dashboard end page content must be rendered and visible");

        // Keep the dashboard end page visible on screen so user can observe success
        try {
            System.out.println(">>> Displaying successful Dashboard end page in Chrome for 5 seconds...");
            Thread.sleep(5000);
        } catch (InterruptedException ignored) {}
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (driver != null) {
            try {
                Thread.sleep(1500);
            } catch (InterruptedException ignored) {}
            driver.quit();
        }
    }
}
