import { test, expect } from '@playwright/test';

test.describe('Error404 Component E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Go to a route that does not exist to trigger Error404Component
    await page.goto('http://localhost:4200/non-existing-page');
  });

  test('should display 404 illustration and message', async ({ page }) => {
    // Verify SVG illustration
    const illustration = page.locator('svg-icon[src="assets/illustrations/404.svg"]');
    await expect(illustration).toBeVisible();

    // Verify heading text
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Booo!');

    // Verify subtext
    const subText = page.locator('p');
    await expect(subText).toContainText('The requested page is missing');
  });

  test('should navigate to /dashboard when Home Page button is clicked', async ({ page }) => {
    const homeButton = page.getByRole('button', { name: 'Home Page' });
    await expect(homeButton).toBeVisible();

    // Click the button
    await homeButton.click();

    // Wait for navigation and assert URL
    await expect(page).toHaveURL(/\/dashboard$/);

    // Optional: verify that dashboard content is present
    const mainDashboardText = page.locator('[data-testid="main-dashboard-text"]');
    await expect(mainDashboardText).toBeVisible();
  });

});
