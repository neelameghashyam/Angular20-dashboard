import { test, expect } from '@playwright/test';

test.describe('Navbar Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/dashboard');
  });

  test.describe('Sidebar Toggle (Desktop)', () => {
    test.beforeEach(async ({ page }) => {
      // Set viewport to desktop size to show sidebar toggle
      await page.setViewportSize({ width: 1024, height: 768 });
    });

    test('should display sidebar toggle button on desktop', async ({ page }) => {
      const sidebarToggleButton = page.locator('button').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/solid/chevron-double-left.svg"]') });
      await expect(sidebarToggleButton).toBeVisible();
    });

    test('should toggle sidebar when button is clicked', async ({ page }) => {
      const sidebarToggleButton = page.locator('button').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/solid/chevron-double-left.svg"]') });
      await expect(sidebarToggleButton).toBeVisible();

      // Check initial state (no rotate-180 class, sidebar visible)
      await expect(sidebarToggleButton).not.toHaveClass(/rotate-180/);

      // Click to toggle sidebar
      await sidebarToggleButton.click();

      // Check for rotate-180 class (indicating sidebar is hidden)
      await expect(sidebarToggleButton).toHaveClass(/rotate-180/);

      // Click again to toggle back
      await sidebarToggleButton.click();

      // Verify rotate-180 class is removed
      await expect(sidebarToggleButton).not.toHaveClass(/rotate-180/);
    });

    test('should have proper accessibility attributes for sidebar toggle', async ({ page }) => {
      const sidebarToggleButton = page.locator('button').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/solid/chevron-double-left.svg"]') });
      await expect(sidebarToggleButton).toHaveAttribute('class', /focus:outline-hidden/);
    });
  });

  test.describe('Mobile Navigation Menu Button', () => {
    test.beforeEach(async ({ page }) => {
      // Set viewport to mobile size
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('should display mobile menu button on mobile viewport', async ({ page }) => {
      const mobileMenuButton = page.locator('button[aria-expanded="false"]').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/outline/menu.svg"]') });
      await expect(mobileMenuButton).toBeVisible();
    });

    test('should trigger mobile menu toggle when clicked', async ({ page }) => {
      const mobileMenuButton = page.locator('button[aria-expanded="false"]').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/outline/menu.svg"]') });
      await expect(mobileMenuButton).toBeVisible();

      // Click mobile menu button
      await mobileMenuButton.click();
    });

    test('should have proper accessibility attributes for mobile menu button', async ({ page }) => {
      const mobileMenuButton = page.locator('button[aria-expanded="false"]').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/outline/menu.svg"]') });
      await expect(mobileMenuButton).toBeVisible();
      await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
      await expect(mobileMenuButton.locator('.sr-only')).toHaveText('Open menu');
    });
  });

  test.describe('Profile Menu Integration', () => {
    test('should render profile menu component', async ({ page }) => {
      const profileMenu = page.locator('app-profile-menu');
      await expect(profileMenu).toBeVisible();
    });

    test('should open profile menu when clicked', async ({ page }) => {
      const profileButton = page.locator('app-profile-menu button').filter({ hasText: 'Open user menu' });
      await expect(profileButton).toBeVisible();

      await profileButton.click();

      // Verify profile menu dropdown is visible
      const profileDropdown = page.locator('app-profile-menu div[class*="absolute"]').filter({ hasText: 'RAM' });
      await expect(profileDropdown).toBeVisible();
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should hide sidebar toggle button on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const sidebarToggleButton = page.locator('button').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/solid/chevron-double-left.svg"]') });
      await expect(sidebarToggleButton).toBeHidden();
    });

    test('should hide mobile menu button on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      const mobileMenuButton = page.locator('button[aria-expanded="false"]').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/outline/menu.svg"]') });
      await expect(mobileMenuButton).toBeHidden();
    });

    test('should show profile menu on both mobile and desktop', async ({ page }) => {
      // Test on mobile
      await page.setViewportSize({ width: 375, height: 667 });
      const profileMenuMobile = page.locator('app-profile-menu');
      await expect(profileMenuMobile).toBeVisible();

      // Test on desktop
      await page.setViewportSize({ width: 1024, height: 768 });
      const profileMenuDesktop = page.locator('app-profile-menu');
      await expect(profileMenuDesktop).toBeVisible();
    });
  });

  test.describe('Styling and Animation', () => {
    test('should apply correct styling to navbar container', async ({ page }) => {
      const navbarContainer = page.locator('app-navbar .bg-background.border-b.border-border');
      await expect(navbarContainer).toBeVisible();
      await expect(navbarContainer).toHaveClass(/bg-background/);
      await expect(navbarContainer).toHaveClass(/border-b/);
      await expect(navbarContainer).toHaveClass(/border-border/);
    });

    test('should apply hover effects to sidebar toggle button', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      const sidebarToggleButton = page.locator('button').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/solid/chevron-double-left.svg"]') });
      await sidebarToggleButton.hover();
      await expect(sidebarToggleButton).toHaveClass(/hover:text-muted-foreground/);
    });

    test('should apply hover effects to mobile menu button', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const mobileMenuButton = page.locator('button[aria-expanded="false"]').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/outline/menu.svg"]') });
      await mobileMenuButton.hover();
      await expect(mobileMenuButton).toHaveClass(/hover:bg-muted-foreground/);
      await expect(mobileMenuButton).toHaveClass(/hover:text-muted/);
    });

    test('should apply transition animation to sidebar toggle button', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      const sidebarToggleButton = page.locator('button').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/solid/chevron-double-left.svg"]') });
      await expect(sidebarToggleButton).toHaveClass(/transition-all/);
      await expect(sidebarToggleButton).toHaveClass(/duration-200/);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA attributes for mobile menu button', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const mobileMenuButton = page.locator('button[aria-expanded="false"]').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/outline/menu.svg"]') });
      await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
      await expect(mobileMenuButton.locator('.sr-only')).toHaveText('Open menu');
    });

    test('should have proper focus management for sidebar toggle', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      const sidebarToggleButton = page.locator('button').filter({ has: page.locator('svg-icon[src="assets/icons/heroicons/solid/chevron-double-left.svg"]') });
      await sidebarToggleButton.focus();
      await expect(sidebarToggleButton).toBeFocused();
      await expect(sidebarToggleButton).toHaveClass(/focus:outline-hidden/);
    });
  });
});