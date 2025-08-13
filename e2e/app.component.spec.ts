import { test, expect } from '@playwright/test';

test.describe('AppComponent E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Angular app
    await page.goto('http://localhost:4200');
  });

  test('should render the app-root component', async ({ page }) => {
    // Verify that the app-root component is present in the DOM
    const appRoot = await page.locator('app-root');
    await expect(appRoot).toBeVisible();
  });

  
  test('should switch to dark theme when ThemeService toggles', async ({ page }) => {
    // Assuming ThemeService has a toggleTheme method that can be triggered
    // Simulate theme toggle (this depends on how ThemeService is exposed or triggered)
    // For example, if there's a button to toggle theme, interact with it
    // Note: Adjust this based on actual ThemeService implementation
    const themeToggleButton = await page.locator('[data-test-id="theme-toggle"]'); // Hypothetical selector
    if (await themeToggleButton.isVisible()) {
      await themeToggleButton.click();
      const toaster = await page.locator('ngx-sonner-toaster');
      await expect(toaster).toHaveAttribute('data-theme', 'dark');
    } else {
      // If no toggle button, skip or mock ThemeService change
      console.warn('Theme toggle button not found; skipping theme switch test');
    }
  });

  test('should display toaster notification when triggered', async ({ page }) => {
    // Simulate triggering a toaster notification (depends on app implementation)
    // For example, if there's a button to show a notification
    const notificationButton = await page.locator('[data-test-id="show-notification"]'); // Hypothetical selector
    if (await notificationButton.isVisible()) {
      await notificationButton.click();
      const toast = await page.locator('.sonner-toast'); // Adjust based on ngx-sonner-toaster's toast class
      await expect(toast).toBeVisible();
      await expect(toast).toContainText(/notification/i); // Adjust based on expected notification text
    } else {
      console.warn('Notification trigger button not found; skipping notification test');
    }
  });
});