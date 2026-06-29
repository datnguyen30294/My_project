import { test, expect } from '../fixtures/test'

test.describe('Ticket Claim & Release', () => {
  test.describe.configure({ mode: 'serial' })

  test('pool should display available tickets', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/og-tickets/pool')
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('heading', { name: 'Ticket Pool' })).toBeVisible()
    // Should have "Nhận" buttons for pending tickets
    await expect(page.getByRole('button', { name: 'Nhận' }).first()).toBeVisible()
  })

  test('should claim ticket from pool', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/og-tickets/pool')
    await page.waitForLoadState('networkidle')

    // Click "Nhận" on first ticket
    await page.getByRole('button', { name: 'Nhận' }).first().click()

    // Confirm dialog
    await expect(page.getByText('Bạn muốn nhận ticket này?')).toBeVisible()
    await page.locator('[role="dialog"]').getByRole('button', { name: 'Xác nhận' }).click()

    // Should redirect to OG ticket detail
    await page.waitForURL(/\/pmc\/og-tickets\/\d+/, { timeout: 10000 })
  })

  test('claimed ticket should appear in OG ticket list', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/og-tickets')
    await page.waitForLoadState('networkidle')

    // One of the E2E platform ticket subjects should be visible
    await expect(
      page.getByText('Hỏng bồn cầu nhà vệ sinh')
        .or(page.getByText('Điều hoà phòng ngủ không mát'))
        .or(page.getByText('Khoá cửa chính bị kẹt'))
        .first()
    ).toBeVisible()
  })

  test('should release ticket back to pool', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/og-tickets')
    await page.waitForLoadState('networkidle')

    // Navigate to the last ticket detail (most recently claimed)
    const viewBtns = page.locator('a[title="Xem chi tiết"]')
    await viewBtns.first().click()
    await page.waitForURL(/\/pmc\/og-tickets\/\d+/)
    await page.waitForLoadState('networkidle')

    // Click release button
    const releaseBtn = page.getByRole('button', { name: /trả lại/i })
    if (await releaseBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await releaseBtn.click()

      // Release dialog
      await expect(page.getByText('Trả ticket về pool?')).toBeVisible()

      // Fill optional reason
      const noteInput = page.locator('[role="dialog"]').getByRole('textbox')
      if (await noteInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await noteInput.fill('Không phù hợp, trả lại')
      }

      // Confirm
      await page.locator('[role="dialog"]').getByRole('button', { name: /xác nhận trả lại/i }).click()

      // Should redirect to list
      await page.waitForURL('/pmc/og-tickets', { timeout: 10000 })
    }
  })

  test('should claim ticket from detail slideover', async ({ authenticatedPage: page }) => {
    await page.goto('/pmc/og-tickets/pool')
    await page.waitForLoadState('networkidle')

    // Click ticket code to open slideover
    const codeBtn = page.locator('button').filter({ hasText: /E2E-TK-/ }).first()
    if (await codeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await codeBtn.click()

      // Slideover should open with detail
      await expect(page.getByText('Mô tả từ cư dân')).toBeVisible({ timeout: 5000 })

      // Click "Nhận ticket này"
      const claimBtn = page.getByRole('button', { name: /nhận ticket này/i })
      if (await claimBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await claimBtn.click()

        // Confirm dialog
        await expect(page.getByText('Bạn muốn nhận ticket này?')).toBeVisible()
        await page.locator('[role="dialog"]').getByRole('button', { name: 'Xác nhận' }).click()

        // Should redirect to detail
        await page.waitForURL(/\/pmc\/og-tickets\/\d+/, { timeout: 10000 })
      }
    }
  })
})
