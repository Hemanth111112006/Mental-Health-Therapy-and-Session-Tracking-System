# SoftwareTesting — IntelliJ IDEA Automation & Testing Suite

A complete, ready-to-run **Software Testing** project configured for **IntelliJ IDEA**, Maven, Selenium WebDriver, TestNG, JUnit 5, and REST Assured.

---

## 📁 Project Structure

```
SoftwareTesting/
├── .idea/                           # IntelliJ IDEA project settings & SDK bindings
├── src/
│   ├── main/
│   │   ├── java/com/testing/
│   │   │   ├── Main.java            # Suite entrypoint
│   │   │   └── utils/
│   │   │       └── ConfigReader.java # Helper for config.properties
│   │   └── resources/
│   │       └── config.properties    # Base URLs, browser selection, credentials
│   └── test/
│       ├── java/com/testing/
│       │   ├── unit/
│       │   │   └── CalculatorTest.java      # Unit testing, BVA, Equivalence Partitioning
│       │   ├── selenium/
│       │   │   └── LoginAutomationTest.java # Selenium UI testing with automatic ChromeDriver
│       │   └── api/
│       │       └── MindCareApiTest.java     # REST Assured API testing
│       └── resources/
│           └── testng.xml           # TestNG Suite Runner configuration
├── pom.xml                          # Maven dependencies & plugins
├── .gitignore                       # Standard Java/IntelliJ gitignore
└── README.md
```

---

## 🚀 How to Open in IntelliJ IDEA

1. Open **IntelliJ IDEA**.
2. Click **File** &rarr; **Open...** (or **Open Project** on the welcome screen).
3. Navigate to:
   ```
   C:\Users\HEMANTH\IdeaProjects\SoftwareTesting
   ```
4. Click **OK**.
5. IntelliJ will automatically detect `pom.xml` and import all Maven dependencies (`Selenium`, `TestNG`, `WebDriverManager`, `REST Assured`).

---

## 🧪 How to Run Tests

### In IntelliJ IDEA:
- **Run the Entire Suite**: Right-click `src/test/resources/testng.xml` &rarr; click **Run '.../testng.xml'**.
- **Run a Specific Test Class**: Open any test file (e.g. `CalculatorTest.java` or `LoginAutomationTest.java`), right-click anywhere in the editor &rarr; click **Run**.
- **Run an Individual Test Method**: Click the green **Run (▶)** icon in the left gutter next to any `@Test` method.

### Via Command Line (Maven):
```bash
mvn test
```

---

## ⚙️ Configuration (`config.properties`)

Edit `src/main/resources/config.properties` to customize:
- `app.base.url`: Target web application (default: `http://localhost:5173`)
- `api.base.url`: Target backend REST API (default: `http://localhost:8080/api`)
- `browser`: Browser engine (`chrome`, `firefox`, `edge`)
- `headless`: Run without visible browser window (`true` / `false`)
