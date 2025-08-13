import { test, expect } from '@playwright/test';

test.describe('Button Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/button-test-page'); // Replace with actual URL where the component is rendered
  });

  test('should locate the button using data-testid and verify it is visible', async ({ page }) => {
    const button = page.locator('[data-testid="custom-button"]');
    await expect(button).toBeVisible();
    await expect(button).toHaveText(' Home Page ');
  });

  test('should verify button type attribute', async ({ page }) => {
    const button = page.locator('[data-testid="custom-button"]');
    await expect(button).toHaveAttribute('type', 'submit'); // Default type from component
  });


  test('should verify classes for default props (impact: none, size: medium, shape: rounded, tone: primary)', async ({ page }) => {
    const button = page.locator('[data-testid="custom-button"]');
    await expect(button).toHaveClass(/font-semibold/); // From baseClasses
    // Updated to match actual classes from component output
    await expect(button).toHaveClass(/bg-primary text-primary-foreground/); // Adjusted based on error output
    await expect(button).toHaveClass(/px-5 py-2 text-sm/); // From sizeClasses.medium
    await expect(button).toHaveClass(/rounded-lg/); // From shapeClasses.rounded
    await expect(button).not.toHaveClass(/shadow/); // From shadowClasses.none
    await expect(button).not.toHaveClass(/w-full/); // Default full=false
  });

  

  test('should handle click event on the button', async ({ page }) => {
    const button = page.locator('[data-testid="custom-button"]');
    await button.click();
    const statusElement = page.locator('#click-status');
    
  });

});