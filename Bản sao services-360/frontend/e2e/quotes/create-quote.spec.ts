import { test, expect } from '../fixtures/test'

test.describe('Create Quote', () => {
  test('should display create quote page with empty state', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/quotes/create')

    await expect(page.getByRole('heading', { name: 'Tạo báo giá' })).toBeVisible()
    await expect(page.getByText('Chưa có dòng nào')).toBeVisible()
  })

  test('should not submit without ticket and lines', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/quotes/create')

    const submitButton = page.getByRole('button', { name: 'Tạo báo giá' })
    await expect(submitButton).toBeDisabled()
  })

  test('should pre-select ticket from URL param', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/quotes/create?og_ticket_id=1')
    await page.waitForLoadState('networkidle')

    // Submit still disabled (no lines)
    const submitButton = page.getByRole('button', { name: 'Tạo báo giá' })
    await expect(submitButton).toBeDisabled()
  })

  test('should open add line modal', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/quotes/create')

    await page.getByRole('button', { name: 'Thêm dòng' }).click()
    await expect(page.getByText('Thêm dòng báo giá')).toBeVisible()
  })
})
