import { test, expect } from '@playwright/test';

test.describe('Users Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/dashboard/users'); 
  });

  test('should render Users component and display correct text', async ({ page }) => {
    const usersText = page.locator('[data-testid="users-text"]');
    await expect(usersText).toBeVisible();
    await expect(usersText).toHaveText('users works!');
  });
});