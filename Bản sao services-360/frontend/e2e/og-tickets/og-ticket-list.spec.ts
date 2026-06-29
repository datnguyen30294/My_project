import { test, expect } from '../fixtures/test'

test.describe('OG Ticket List', () => {
  test('should display og ticket list page', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/og-tickets')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('OG Ticket')).toBeVisible()
  })

  test('should show seeded tickets in table', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/og-tickets')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Sửa chữa ống nước bị rò rỉ tầng 5')).toBeVisible()
    await expect(page.getByText('Thay bóng đèn hành lang tầng 3')).toBeVisible()
  })

  test('should filter by status', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/og-tickets')
    await page.waitForLoadState('networkidle')

    // Use status filter
    const statusFilter = page.getByPlaceholder('Trạng thái')
    if (await statusFilter.isVisible()) {
      await statusFilter.click()
      await page.getByText('Đang khảo sát').click()
      await page.waitForLoadState('networkidle')
      await expect(page.getByText('Sơn lại tường phòng khách')).toBeVisible()
    }
  })

  test('should navigate to ticket detail via view button', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/og-tickets')
    await page.waitForLoadState('networkidle')

    // Click the view (eye) button on first row
    const viewBtn = page.locator('a[title="Xem chi tiết"]').first()
    await viewBtn.click()
    await page.waitForURL(/\/pmc\/og-tickets\/\d+/)
  })
})
