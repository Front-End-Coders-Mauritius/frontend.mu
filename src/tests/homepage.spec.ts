import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle(/Front-End Coders Mauritius/);
});


test('upcoming meetups visible', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.getByRole('heading', { name: 'Upcoming Meetups' })).toBeVisible();
});