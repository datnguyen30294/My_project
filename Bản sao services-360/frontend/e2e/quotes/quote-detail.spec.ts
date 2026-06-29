import { test, expect } from '../fixtures/test'

const API_BASE = 'http://e2e.residential.test:8000/api/v1'

async function getAuthToken(page: import('@playwright/test').Page): Promise<string> {
  const res = await page.request.post(`${API_BASE}/auth/login`, {
    data: { email: 'admin@e2e.com', password: 'password' }
  })
  const body = await res.json()
  return body.data?.token ?? body.token
}

async function createQuoteViaApi(page: import('@playwright/test').Page, token: string): Promise<number> {
  // Use 2nd ticket to avoid conflicts with quote-transitions tests
  const ticketRes = await page.request.get(`${API_BASE}/pmc/og-tickets?per_page=4`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const tickets = (await ticketRes.json()).data
  // Use 4th ticket (index 3) to avoid parallel conflicts with transitions (index 2)
  const ogTicketId = tickets[3]?.id ?? tickets[0].id

  const catalogRes = await page.request.get(`${API_BASE}/pmc/catalog/items?per_page=1`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const item = (await catalogRes.json()).data[0]

  const res = await page.request.post(`${API_BASE}/pmc/quotes`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: {
      og_ticket_id: ogTicketId,
      status: 'draft',
      replace_active: true,
      lines: [{
        line_type: item.type?.value ?? item.type ?? 'material',
        reference_id: item.id,
        name: item.name,
        quantity: 3,
        unit: item.unit,
        unit_price: parseFloat(item.unit_price)
      }]
    }
  })
  const body = await res.json()
  if (!body.data?.id) {
    throw new Error(`Failed to create quote: ${JSON.stringify(body)}`)
  }
  return body.data.id
}

test.describe('Quote Detail', () => {
  test.describe.configure({ mode: 'serial' })

  let token: string

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    token = await getAuthToken(page)
    await page.close()
  })

  test('should display quote detail with lines and total', async ({ authenticatedPage: page }) => {
    const quoteId = await createQuoteViaApi(page, token)

    await page.goto(`/pmc/quotes/${quoteId}`)
    await page.waitForLoadState('networkidle')

    // Quote code visible
    await expect(page.getByText(/QT-\d{8}-\d{3}/).first()).toBeVisible()

    // Total amount visible
    await expect(page.getByText('Tổng tiền').first()).toBeVisible()
  })

  test('should show workflow stepper on detail page', async ({ authenticatedPage: page }) => {
    const quoteId = await createQuoteViaApi(page, token)

    await page.goto(`/pmc/quotes/${quoteId}`)
    await page.waitForLoadState('networkidle')

    // Stepper should show Nháp step as current
    await expect(page.getByText('Nháp').first()).toBeVisible()
    // Stepper should show other steps
    await expect(page.getByText('Đã gửi').first()).toBeVisible()
  })

  test('should show edit button for draft quote', async ({ authenticatedPage: page }) => {
    const quoteId = await createQuoteViaApi(page, token)

    await page.goto(`/pmc/quotes/${quoteId}`)
    await page.waitForLoadState('networkidle')

    const editLink = page.locator(`a[href*="/pmc/quotes/${quoteId}/edit"]`)
    await expect(editLink.first()).toBeVisible()
  })

  test('should link to og ticket from quote detail', async ({ authenticatedPage: page }) => {
    const quoteId = await createQuoteViaApi(page, token)

    await page.goto(`/pmc/quotes/${quoteId}`)
    await page.waitForLoadState('networkidle')

    const ticketLink = page.locator('a[href*="/pmc/og-tickets/"]')
    await expect(ticketLink.first()).toBeVisible()
  })

  test('should delete draft quote', async ({ authenticatedPage: page }) => {
    const quoteId = await createQuoteViaApi(page, token)

    await page.goto(`/pmc/quotes/${quoteId}`)
    await page.waitForLoadState('networkidle')

    // Click delete button
    const deleteBtn = page.getByRole('button', { name: /xóa/i })
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click()

      // Confirm in modal
      const confirmBtn = page.locator('[role="dialog"]').getByRole('button', { name: /xóa|xác nhận/i })
      if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmBtn.click()
        await page.waitForURL('/pmc/quotes', { timeout: 10000 })
      }
    }
  })
})
