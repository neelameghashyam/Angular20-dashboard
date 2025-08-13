import { test, expect } from '@playwright/test';

test.describe('MainDashboard Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/dashboard'); 
  });

   test('should load MainDashboard component and verify text content', async ({ page }) => {
    const mainDashboardText = page.locator('[data-testid="main-dashboard-text"]');
    await expect(mainDashboardText).toBeVisible();
    await expect(mainDashboardText).toHaveText('main-dashboard works!');
  });

});