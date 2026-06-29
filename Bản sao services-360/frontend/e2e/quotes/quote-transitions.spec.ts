import { test, expect } from '../fixtures/test'

const API_BASE = 'http://e2e.residential.test:8000/api/v1'

async function getAuthToken(page: import('@playwright/test').Page): Promise<string> {
  const res = await page.request.post(`${API_BASE}/auth/login`, {
    data: { email: 'admin@e2e.com', password: 'password' }
  })
  const body = await res.json()
  return body.data?.token ?? body.token
}

async function getOgTicketId(page: import('@playwright/test').Page, token: string, index = 2): Promise<number> {
  const res = await page.request.get(`${API_BASE}/pmc/og-tickets?per_page=4`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const body = await res.json()
  return body.data[index]?.id ?? body.data[0].id
}

async function createDraftQuote(
  page: import('@playwright/test').Page,
  token: string,
  ogTicketId: number
): Promise<number> {
  const catalogRes = await page.request.get(`${API_BASE}/pmc/catalog/items?per_page=1`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const catalogBody = await catalogRes.json()
  const item = catalogBody.data[0]

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
        quantity: 2,
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

async function transitionQuote(page: import('@playwright/test').Page, token: string, quoteId: number, status: string) {
  await page.request.post(`${API_BASE}/pmc/quotes/${quoteId}/transition`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: { status }
  })
}

test.describe('Quote Status Transitions', () => {
  // Transitions share an OG ticket — run serially to avoid unique constraint violations
  test.describe.configure({ mode: 'serial' })

  let token: string
  let ogTicketId: number

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    token = await getAuthToken(page)
    ogTicketId = await getOgTicketId(page, token, 2)
    await page.close()
  })

  test('draft → sent: should send quote to manager', async ({ authenticatedPage: page }) => {
    const quoteId = await createDraftQuote(page, token, ogTicketId)
    await page.goto(`/pmc/quotes/${quoteId}`)
    await page.waitForLoadState('networkidle')

    const sendBtn = page.getByRole('button', { name: /gửi báo giá/i })
    await expect(sendBtn).toBeVisible({ timeout: 10000 })
    await sendBtn.click()

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await expect(page.getByText('Đã gửi').first()).toBeVisible({ timeout: 10000 })
  })

  test('sent → manager_approved: should approve as manager', async ({ authenticatedPage: page }) => {
    const quoteId = await createDraftQuote(page, token, ogTicketId)
    await transitionQuote(page, token, quoteId, 'sent')

    await page.goto(`/pmc/quotes/${quoteId}`)
    await page.waitForLoadState('networkidle')

    const approveBtn = page.getByRole('button', { name: /quản lý duyệt/i })
    await expect(approveBtn).toBeVisible()
    await approveBtn.click()

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await expect(page.getByText('QL đã duyệt').first()).toBeVisible()
  })

  test('manager_approved → approved: should approve as resident', async ({ authenticatedPage: page }) => {
    const quoteId = await createDraftQuote(page, token, ogTicketId)
    await transitionQuote(page, token, quoteId, 'sent')
    await transitionQuote(page, token, quoteId, 'manager_approved')

    await page.goto(`/pmc/quotes/${quoteId}`)
    await page.waitForLoadState('networkidle')

    const approveBtn = page.getByRole('button', { name: /cư dân chấp thuận/i })
    await expect(approveBtn).toBeVisible()
    await approveBtn.click()

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await expect(page.getByText('Đã chấp thuận').first()).toBeVisible()
  })

  test('sent → manager_rejected: should reject as manager', async ({ authenticatedPage: page }) => {
    const quoteId = await createDraftQuote(page, token, ogTicketId)
    await transitionQuote(page, token, quoteId, 'sent')

    await page.goto(`/pmc/quotes/${quoteId}`)
    await page.waitForLoadState('networkidle')

    const rejectBtn = page.getByRole('button', { name: /quản lý từ chối/i })
    await expect(rejectBtn).toBeVisible()
    await rejectBtn.click()

    // Fill reject note in modal if visible
    const noteInput = page.locator('[role="dialog"]').getByRole('textbox')
    if (await noteInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await noteInput.fill('Giá quá cao')
    }

    // Confirm
    const confirmBtn = page.locator('[role="dialog"]').getByRole('button', { name: /xác nhận|từ chối/i }).last()
    await confirmBtn.click()

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await expect(page.getByText('QL từ chối').first()).toBeVisible()
  })

  test('manager_approved → resident_rejected: should reject as resident', async ({ authenticatedPage: page }) => {
    const quoteId = await createDraftQuote(page, token, ogTicketId)
    await transitionQuote(page, token, quoteId, 'sent')
    await transitionQuote(page, token, quoteId, 'manager_approved')

    await page.goto(`/pmc/quotes/${quoteId}`)
    await page.waitForLoadState('networkidle')

    const rejectBtn = page.getByRole('button', { name: /cư dân từ chối/i })
    await expect(rejectBtn).toBeVisible()
    await rejectBtn.click()

    const noteInput = page.locator('[role="dialog"]').getByRole('textbox')
    if (await noteInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await noteInput.fill('Không đồng ý')
    }

    const confirmBtn = page.locator('[role="dialog"]').getByRole('button', { name: /xác nhận|từ chối/i }).last()
    await confirmBtn.click()

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await expect(page.getByText('Cư dân từ chối').first()).toBeVisible()
  })

  test('approved quote should show no available actions', async ({ authenticatedPage: page }) => {
    const quoteId = await createDraftQuote(page, token, ogTicketId)
    await transitionQuote(page, token, quoteId, 'sent')
    await transitionQuote(page, token, quoteId, 'manager_approved')
    await transitionQuote(page, token, quoteId, 'approved')

    await page.goto(`/pmc/quotes/${quoteId}`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Đã chấp thuận').first()).toBeVisible()
    await expect(page.getByText('Không có hành động khả dụng')).toBeVisible()
  })
})
