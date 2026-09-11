package com.testing.unit;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

/**
 * Unit Testing demonstration showcasing:
 * - TestNG @Test annotations
 * - Equivalence Class Partitioning (ECP)
 * - Boundary Value Analysis (BVA)
 * - Data-Driven Testing with @DataProvider
 */
public class CalculatorTest {

    // Simple business logic under test
    public static class SimpleMath {
        public static int add(int a, int b) {
            return a + b;
        }

        public static int divide(int a, int b) {
            if (b == 0) {
                throw new ArithmeticException("Cannot divide by zero");
            }
            return a / b;
        }

        /**
         * Validates patient age for mental health EHR intake.
         * Valid age range: 1 to 120 (inclusive).
         */
        public static boolean isValidPatientAge(int age) {
            return age >= 1 && age <= 120;
        }
    }

    @Test(description = "Verify standard addition of two positive integers")
    public void testPositiveAddition() {
        int result = SimpleMath.add(15, 25);
        Assert.assertEquals(result, 40, "15 + 25 must equal 40");
    }

    @Test(description = "Verify addition with negative numbers")
    public void testNegativeAddition() {
        int result = SimpleMath.add(-10, 5);
        Assert.assertEquals(result, -5, "-10 + 5 must equal -5");
    }

    @Test(expectedExceptions = ArithmeticException.class, description = "Verify division by zero throws ArithmeticException")
    public void testDivideByZeroThrowsException() {
        SimpleMath.divide(100, 0);
    }

    // ── Boundary Value Analysis (BVA) Data Provider ───────────────────────────
    @DataProvider(name = "ageBoundaryData")
    public Object[][] getAgeBoundaryData() {
        return new Object[][] {
            // { age, expectedValid, testCaseDescription }
            { 0,   false, "Just below minimum boundary (0)" },
            { 1,   true,  "At minimum boundary (1)" },
            { 2,   true,  "Just above minimum boundary (2)" },
            { 65,  true,  "Nominal / typical value (65)" },
            { 119, true,  "Just below maximum boundary (119)" },
            { 120, true,  "At maximum boundary (120)" },
            { 121, false, "Just above maximum boundary (121)" },
            { -5,  false, "Negative invalid boundary (-5)" }
        };
    }

    @Test(dataProvider = "ageBoundaryData", description = "Boundary Value Analysis on Patient Age Validation")
    public void testPatientAgeBoundary(int age, boolean expectedValid, String testCase) {
        boolean actual = SimpleMath.isValidPatientAge(age);
        Assert.assertEquals(actual, expectedValid, "Failed for: " + testCase);
    }
}
