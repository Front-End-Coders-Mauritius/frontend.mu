import { test, expect } from '@playwright/test';

test('sandeep pages', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByText('All meetups').first().click();
    await expect(page.locator('h1')).toContainText('All meetups');
    await expect(page.getByRole('link', { name: 'The CSS Meetup' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Vue / Tailwind / OpenData' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ReactJS' })).toBeVisible();
    await page.getByTitle('Meetup ReactJS').click(); // Go to the reactjs meetup page
    await page.getByTitle('Speaker name: Sandeep Ramgolam').click(); // Go to the speaker page for Sandeep Ramgolam
    await page.getByRole('link', { name: 'Sat May 20 2023 Git, CVs &' }).click(); // Go to the meetup page for Git, CVs & getting in to tech
    await expect(page.getByRole('heading', { name: 'Git, CVs & getting in to tech' })).toBeVisible(); // Check that we are on the right page
});