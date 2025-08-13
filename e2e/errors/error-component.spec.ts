import { test, expect } from '@playwright/test';

test.describe('Error Component E2E Tests', () => {

  test('should render Error404Component inside ErrorComponent', async ({ page }) => {
    // Navigate to the 404 error route
    await page.goto('http://localhost:4200/errors/404');

    // Verify the container layout
    const container = page.locator('div.flex.h-screen.w-screen');
    await expect(container).toBeVisible();

    // Verify that Error404 content is present
    const heading404 = page.locator('h1');
    await expect(heading404).toBeVisible();
    await expect(heading404).toHaveText('Booo!');

    const homeButton = page.getByRole('button', { name: 'Home Page' });
    await expect(homeButton).toBeVisible();
  });

  test('should render Error500Component inside ErrorComponent', async ({ page }) => {
    // Navigate to the 500 error route
    await page.goto('http://localhost:4200/errors/500');

    // Verify the container layout
    const container = page.locator('div.flex.h-screen.w-screen');
    await expect(container).toBeVisible();

    // Verify that Error500 content is present
    const heading500 = page.locator('h1');
    await expect(heading500).toBeVisible();
    await expect(heading500).toHaveText('Oops! Server Error');

    const homeButton = page.getByRole('button', { name: 'Homepage' });
    await expect(homeButton).toBeVisible();
  });

});
