import { test, expect } from '@playwright/test';

test('sandeep pages', async ({ page }) => {
    await page.goto('/');
    await page.getByText('View all meetups').first().click();
    await expect(page.locator('h1').first()).toContainText('All meetups');
    await page.goto('/team');
    await page.getByTitle('Sandeep Ramgolam').first().click(); // Go to the speaker page for Sandeep Ramgolam
    await page.getByRole('link', { name: 'Sat May 20 2023 Git, CVs &' }).click(); // Go to the meetup page for Git, CVs & getting in to tech
    await expect(page.getByRole('heading', { name: 'Git, CVs & getting in to tech' })).toBeVisible(); // Check that we are on the right page
});