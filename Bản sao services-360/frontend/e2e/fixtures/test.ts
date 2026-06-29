import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Extended test fixture with auth helpers.
 * Import { test, expect } from this file in all E2E tests.
 *
 * NOTE: laravel-playwright factory doesn't work well with multi-tenancy
 * (tenant tables not available in central DB context).
 * Instead, we login via the API using existing seeded users.
 */

const DEFAULT_EMAIL = process.env.E2E_USER_EMAIL ?? 'admin@e2e.com'
const DEFAULT_PASSWORD = process.env.E2E_USER_PASSWORD ?? 'password'

export const test = base.extend<{
  authenticatedPage: Page
}>({
  authenticatedPage: async ({ page }, use) => {
    const apiBaseUrl = process.env.E2E_API_URL ?? 'http://e2e.residential.test:8000/api/v1'

    // Login via API to get token from seeded user
    const response = await page.request.post(`${apiBaseUrl}/auth/login`, {
      data: { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD }
    })

    if (!response.ok()) {
      throw new Error(`Login failed (${response.status()}): ${await response.text()}`)
    }

    const body = await response.json()
    const token = body.data?.token ?? body.token

    if (!token) {
      throw new Error(`No token in login response: ${JSON.stringify(body)}`)
    }

    // Set token in localStorage before navigating
    await page.goto('/')
    await page.evaluate((t) => {
      localStorage.setItem('access_token', t)
    }, token)

    await use(page)
  }
})

export { expect }
