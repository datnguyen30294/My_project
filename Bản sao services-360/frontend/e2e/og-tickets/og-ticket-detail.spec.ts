import { test, expect } from '../fixtures/test'

test.describe('OG Ticket Detail', () => {
  async function goToFirstTicketDetail(page: import('@playwright/test').Page) {
    await page.goto('/pmc/og-tickets')
    await page.waitForLoadState('networkidle')
    const viewBtn = page.locator('a[title="Xem chi tiết"]').first()
    await viewBtn.click()
    await page.waitForURL(/\/pmc\/og-tickets\/\d+/)
  }

  test('should display ticket detail', async ({ authenticatedPage: page }) => {
    await goToFirstTicketDetail(page)

    // Verify detail page loaded (wait for content to render)
    await page.waitForLoadState('networkidle')
    // Check any seeded requester phone or name is visible
    await expect(page.getByText('0901234567')
      .or(page.getByText('0912345678'))
      .or(page.getByText('0923456789'))
      .or(page.getByText('0934567890'))
    ).toBeVisible()
  })

  test('should show create quote button', async ({ authenticatedPage: page }) => {
    await goToFirstTicketDetail(page)

    const createQuoteBtn = page.getByRole('link', { name: /báo giá/i })
      .or(page.locator('a[href*="/pmc/quotes/create"]'))
    await expect(createQuoteBtn.first()).toBeVisible()
  })

  test('should navigate to create quote from ticket detail', async ({ authenticatedPage: page }) => {
    await goToFirstTicketDetail(page)

    const createQuoteLink = page.locator('a[href*="/pmc/quotes/create"]').first()
    await createQuoteLink.click()

    await page.waitForURL(/\/pmc\/quotes\/create/)
    await expect(page.getByRole('heading', { name: 'Tạo báo giá' })).toBeVisible()
  })

  test('should navigate to edit page', async ({ authenticatedPage: page }) => {
    await goToFirstTicketDetail(page)

    const editLink = page.locator('a[href*="/edit"]').first()
    await editLink.click()
    await page.waitForURL(/\/pmc\/og-tickets\/\d+\/edit/)
  })
})
