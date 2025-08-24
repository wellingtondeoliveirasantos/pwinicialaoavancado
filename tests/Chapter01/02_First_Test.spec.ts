// Import playwright module
import { test, expect } from '@playwright/test';

/**
 * Author Testers Talk
 */
test('My First Playwright TypeScript Test', async ({ page }) => {
    // Go to URL
    await page.goto('https://www.youtube.com/');

    // Search with keywords
    await page.getByPlaceholder('Search').first().click();
    await page.getByPlaceholder('Search').first().fill('playwright by testers talk ');

    // Click on playlist
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.getByRole('link', { name: 'Playwright by Testers Talk☑️' }).click();
    
});