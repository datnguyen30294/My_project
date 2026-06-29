import { test, expect } from '../fixtures/test'

test.describe('Quote List', () => {
  test('should display quote list page', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/quotes')

    await expect(page.getByRole('heading', { name: 'Báo giá' })).toBeVisible()
  })

  test('should have create quote button', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/quotes')

    const createBtn = page.getByRole('link', { name: /tạo báo giá/i })
      .or(page.getByRole('button', { name: /tạo báo giá/i }))
    await expect(createBtn).toBeVisible()
  })

  test('should navigate to create page', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/quotes')

    const createBtn = page.getByRole('link', { name: /tạo báo giá/i })
      .or(page.getByRole('button', { name: /tạo báo giá/i }))
    await createBtn.click()

    await page.waitForURL('/pmc/quotes/create')
    await expect(page.getByRole('heading', { name: 'Tạo báo giá' })).toBeVisible()
  })
})
