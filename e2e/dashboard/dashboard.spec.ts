import { test, expect } from '@playwright/test';

test.describe('Dashboard Component E2E Tests', () => {

  test('should load MainDashboard component when navigating to /dashboard', async ({ page }) => {
    await page.goto('http://localhost:4200/dashboard');

    // Expect the main dashboard child to be loaded
    const mainDashboardText = page.locator('[data-testid="main-dashboard-text"]');
    await expect(mainDashboardText).toBeVisible();
    await expect(mainDashboardText).toHaveText('main-dashboard works!');
  });

  test('should load Users component when navigating to /dashboard/users', async ({ page }) => {
    await page.goto('http://localhost:4200/dashboard/users');

    // Expect the users child to be loaded
    const usersText = page.locator('[data-testid="users-text"]');
    await expect(usersText).toBeVisible();
    await expect(usersText).toHaveText('users works!');
  });

});
