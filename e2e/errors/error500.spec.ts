import { test, expect } from '@playwright/test';

test.describe('Error500 Component E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the page that renders Error500Component
    // Adjust this path based on your routing setup
    await page.goto('http://localhost:4200/errors/500');
  });

  test('should display 500 error illustration and message', async ({ page }) => {
    // Verify SVG illustration
    const illustration = page.locator('svg-icon[src="assets/illustrations/500.svg"]');
    await expect(illustration).toBeVisible();

    // Verify heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Oops! Server Error');

    // Verify error description text
    const errorMessage = page.locator('p');
    await expect(errorMessage).toContainText('Please try again later');
  });

  test('should navigate to /dashboard when Homepage button is clicked', async ({ page }) => {
    // Find the Homepage button
    const homeButton = page.getByRole('button', { name: 'Homepage' });
    await expect(homeButton).toBeVisible();

    // Click the button
    await homeButton.click();

    // Ensure navigation to /dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    // Optional: verify dashboard content after navigation
    const mainDashboardText = page.locator('[data-testid="main-dashboard-text"]');
    await expect(mainDashboardText).toBeVisible();
  });

});
