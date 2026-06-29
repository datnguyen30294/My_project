# Spec: E2E golden-path cho Platform console

- **Ngày**: 2026-06-18
- **Trạng thái**: Design đã duyệt — chờ review spec để sang writing-plans
- **Phương pháp test**: Playwright browser E2E (chạy trên host), drive UI platform console residential + drive resi_mart qua HTTP API
- **Mục tiêu**: Chứng minh luồng *tạo tenant → tạo vendor → có đơn → báo cáo phản ánh đúng* đã thông end-to-end, đồng thời dựng hạ tầng E2E platform tái dùng cho các spec sau.

---

## 1. Quyết định đã chốt (qua brainstorming)

| # | Quyết định | Lựa chọn |
|---|---|---|
| 1 | Tầng test | **Playwright browser E2E** (`/platform` UI), giống các spec PMC hiện có |
| 2 | Dữ liệu vendor/marketplace | **resi_mart thật** (cross-DB Postgres), không fake/stub |
| 3 | Tạo tenant | **Tạo mới qua UI** + teardown dọn schema |
| 4 | Drive resi_mart | **Gọi HTTP API resi_mart** ngay trong test (request-context) |
| 5 | CSAT/rating | **Scope out** đợt này (rating chưa wire ở resi_mart, `residentRating` luôn `null`) |
| 6 | Cách tổ chức spec | **Cách A** — một golden-path smoke test + hạ tầng tái dùng |

**Target validate** = platform console residential. resi_mart là nguồn dữ liệu thật, được drive qua API.

---

## 2. Bối cảnh kỹ thuật (đã khảo sát)

### 2.1 Auth platform console (khác PMC)
- Login: `POST /api/v1/platform/auth/login` → guard `requester`, model `RequesterAccount` (central DB).
- Khác: `GET /platform/auth/me`, `POST /platform/auth/logout`.
- FE dùng `$platformApi` với token riêng (không phải token PMC `access_token`).
- `e2e:setup` hiện tại **chưa** seed `RequesterAccount` platform admin → cần bổ sung.

### 2.2 Hạ tầng E2E hiện có (residential)
- `make e2e-setup` → `php artisan e2e:setup --fresh`: tạo **1 tenant E2E PMC** thật trên Postgres (`OrganizationSeedData::E2E_TESTING`), seed projects/accounts/catalog…, domain `e2e.residential.test`, login `admin@e2e.com/password`.
- `frontend/e2e/fixtures/test.ts`: fixture `authenticatedPage` — login qua API như **user PMC**, inject token vào `localStorage('access_token')`.
- `frontend/playwright.config.ts`: `baseURL = http://e2e.residential.test:3000`, `laravelBaseUrl = http://e2e.residential.test:8000/playwright`, chạy trên host (browser cần OS-native).
- Spec hiện có chỉ là PMC (`/pmc/quotes`, `/pmc/og-tickets`). **Chưa có spec nào cho `/platform`.**

### 2.3 FE platform pages liên quan
- `/platform/tenants`, `/platform/tenants/[id]`
- `/platform/quan-ly-van-hanh/quan-ly-vendor` (console Quản lý Vendor), `/platform/partners`, `/platform/partners/[id]`
- `/platform/quan-ly-don-hang/don-hang-dich-vu-vh` (đơn dịch vụ VH = B2B `TenantServiceOrder`)
- `/platform/modules/bao-cao-tong-hop` (cụm 7 báo cáo + hub)

### 2.4 Endpoint platform (residential) chính
- `POST /api/v1/platform/tenants` (tạo tenant), `PUT .../{id}/vendor-feature`, `.../config`
- `POST /api/v1/platform/tenant-service-orders` + `.../{id}/transition` (B2B)
- `GET /api/v1/platform/reports/{overview|revenue|csat|service-adoption|resident-segments|tenant-health|commission-allocation|vendor-scorecard}`

### 2.5 resi_mart (nguồn dữ liệu)
- DB riêng `resi_mart` (host port 5434; trong network Docker `resi_mart_db:5432`). residential đọc qua connection `resi_mart_central` + `resi_mart_tenant` (env `RESIMART_DB_*`).
- **Provision vendor (S2S)**: `POST /api/v1/internal/vendors` (`InternalVendorController`) — tạo `Tenant` (id = slug) + schema `tenant_<slug>` + chạy tenant migrations + seed IAM admin + sync domains. Token-based (`RESI_MART_INTERNAL_*`).
- **Partner backoffice**: `POST /api/v1/partner/catalog/products` (tạo product/offer); `POST /api/v1/partner/orders/{id}/confirm|mark-processing|mark-completed`.
- **Storefront (resident)**: `GET /api/v1/storefront/catalog/products`; `POST /api/v1/storefront/orders/checkout`.
- **resi_mart KHÔNG có Playwright/UI test** — chỉ PHPUnit + seeder/factory → phía resi_mart drive qua API.

### 2.6 Cách residential đọc đơn resi_mart (aggregation)
- `PlatformVendorOrderAggregationExternalService` (`app/Modules/Marketplace/ExternalServices/Platform/`):
  1. Loop `public.partners` (residential central), bỏ qua partner `tenant_id == null`.
  2. `ResiMartConnection::schemaExists($tenant_id)` — bỏ qua nếu schema thiếu (ghi warning, degrade, không throw).
  3. `ResiMartConnection::runInTenantSchema(...)` → query `orders` (`status != cancelled`, trong `[from, to]`, eager `items`).
  4. Match `PartnerCommissionContract` point-in-time (partner_id + tenant_id + project_id; `activated_at ≤ order_date ≤ replaced_at`); nếu `commission_mode = per_order` thì tính & gán recipient (`platform`/`operating_company`). **Đơn không khớp contract → đếm vào `warnings.skipped_orders`, không có commission.**
  5. Output `PlatformVendorOrderRow{ orderId, partnerId, partnerName, projectId, organizationId(=order.tenant_id), type, offerTitle, amount, status, residentRating(=null), createdAt }`.

---

## 3. Phạm vi (Cách A)

**Một** test golden-path duy nhất + hạ tầng. Smoke-level: chứng minh luồng đã thông & report phản ánh đơn, **không** soi exhaustive từng section/KPI.

### 3.1 Các bước golden-path
1. **Login platform admin** — fixture inject token platform; assert vào được `/platform`.
2. **Tạo tenant (UI)** — `/platform/tenants` → form (org code throwaway, tên, liên hệ, service plan) → submit → assert tenant xuất hiện / vào detail. *(Tạo Organization + schema Postgres thật.)*
3. **Tạo vendor (UI → S2S)** — console Quản lý Vendor: tạo/duyệt partner, link vào project của tenant (`partner_project`, bật `is_vendor_enabled`) → trigger S2S provision sang resi_mart (tạo tenant + schema vendor).
4. **Offer + đơn (API resi_mart)** — partner login → tạo product published → storefront checkout đặt đơn (gắn `tenant_id` = org vừa tạo + `project_id` thuộc org) → partner confirm + mark-completed.
5. **(Tuỳ chọn) B2B order (UI)** — `/platform/quan-ly-don-hang/don-hang-dich-vu-vh` tạo đơn + transition `paid` → revenue report có thêm nguồn B2B.
6. **Xem report (UI) + assert** — mở `/platform/modules/bao-cao-tong-hop`: overview, revenue, service-adoption, commission-allocation, vendor-scorecard, tenant-health → assert đơn vừa tạo phản ánh (GMV > 0, order count ≥ 1, tên vendor hiển thị, commission có số). **CSAT**: chỉ assert load + trạng thái "chưa có đánh giá / 0 rated".
7. **Teardown** — xoá Organization + drop schema residential; deprovision vendor + drop schema resi_mart + domains.

### 3.2 "Ổn" nghĩa là gì (định nghĩa pass)
- Mọi trang report load không lỗi (200, không exception UI).
- Revenue/service-adoption/commission/vendor-scorecard/overview phản ánh đơn vừa tạo: GMV/order-count > 0, tên vendor xuất hiện, commission có số (chứng tỏ aggregation cross-DB + contract matching chạy đúng).
- `warnings.schema_missing = false` và đơn **không** rơi vào `skipped_orders` (chứng tỏ provision + commission contract đúng).

---

## 4. Hạ tầng (file mới / sửa)

### 4.1 Frontend (Playwright)
- `frontend/e2e/fixtures/platform.ts` — fixture `platformAdminPage`: login qua `POST /platform/auth/login` (creds platform admin từ env), inject token platform vào storage đúng key FE dùng (`$platformApi`). Mirror pattern `fixtures/test.ts`.
- `frontend/e2e/helpers/resiMart.ts` — client API resi_mart (request-context): `partnerLogin()`, `createProduct()`, `storefrontCheckout()`, `confirmOrder()/completeOrder()`. Base URL + internal token từ env.
- `frontend/e2e/helpers/platformIds.ts` — sinh & giữ định danh throwaway xác định (org code, vendor slug) cho 1 lần chạy.
- `frontend/e2e/platform/platform-golden-path.spec.ts` — test golden-path (mục 3.1).

### 4.2 Backend residential (artisan)
- `E2ePlatformSetupCommand` (`e2e:platform-setup`): seed `RequesterAccount` platform admin (idempotent) + prerequisites tối thiểu để luồng chạy (đảm bảo có thể tạo `PartnerCommissionContract` cho vendor+project — xem A4). Pre-drop tenant/vendor throwaway nếu tồn tại (mirror `e2e:setup --fresh`).
- `E2ePlatformTeardownCommand` (`e2e:platform-teardown`): xoá Organization throwaway + drop schema residential (bypass Stancl events như `E2eSetupCommand`); deprovision vendor resi_mart + drop schema + domains (xem A5).
- Chỉ chạy ở env `local`/`testing` (guard giống `E2eSetupCommand`).

### 4.3 Makefile + env
- Makefile: `e2e-platform-setup` (gọi `e2e:platform-setup`); spec chạy chung `make e2e`.
- Env E2E (tài liệu hoá trong `.env.example` / README E2E): `RESIMART_DB_*`, `RESI_MART_INTERNAL_URL/TOKEN`, `E2E_PLATFORM_EMAIL`, `E2E_PLATFORM_PASSWORD`, `E2E_RESIMART_API_URL`.

---

## 5. Dữ liệu & isolation
- Định danh throwaway **xác định & idempotent**: setup tự pre-drop nếu tồn tại (mirror `e2e:setup --fresh`). Org code ngắn, schema-safe; vendor slug schema-safe.
- Tách biệt hẳn tenant E2E PMC sẵn có (`OrganizationSeedData::E2E_TESTING`) — không đụng dữ liệu PMC.
- Teardown chạy ở `afterAll` (và setup pre-drop) để test re-runnable.

---

## 6. Giả định cần verify ở writing-plans (đã chọn default)
- **A1**: Tạo/duyệt vendor ở platform console **tự** trigger S2S provision resi_mart. *Default: có.* Nếu không, helper gọi `POST /api/v1/internal/vendors` tường minh.
- **A2**: Định dạng `organization_id` của Organization residential (string org code vs UUID) và cách storefront order lấy `tenant_id` (operator) + `project_id` để aggregation attribute đúng. *Cần xác định payload checkout + host routing chính xác.* (Đây là điểm dễ vỡ nhất của golden-path.)
- **A3**: Partner admin login resi_mart sau provision (IAM admin do `TenantIamBootstrapService` seed) — lấy creds/đường login nào.
- **A4**: Phải tồn tại `PartnerCommissionContract` cho vendor+project, nếu không đơn rơi vào `skipped_orders` (không commission). Setup/flow phải tạo (UI hay seed).
- **A5**: Cơ chế deprovision resi_mart cho teardown (S2S delete endpoint vs artisan resi_mart).
- **A6**: Key lưu token platform ở FE (`$platformApi`) để fixture inject đúng chỗ.

---

## 7. Ngoài phạm vi (để Cách B/C sau)
- CSAT/rating thật (cần wire rating ở resi_mart trước).
- resi_mart UI test (Playwright cho storefront/partner backoffice).
- Negative/edge: validate lỗi tạo tenant, luồng duyệt/pause vendor, biến thể commission contract, degradation khi thiếu schema, tổng hợp đa-tenant/đa-vendor, filter date-range per-report.
- Assert exhaustive từng section/KPI của mỗi report.

---

## 8. Rủi ro
- Phụ thuộc **2 app cùng chạy** + cross-DB config đúng → fragile, khó CI hơn spec PMC.
- **A1/A2** nếu lệch → đơn không được attribute → report không phản ánh → golden-path fail. **Phải verify sớm nhất ở planning** (ưu tiên đọc code S2S provision + storefront checkout + aggregation trước khi viết test).
- Teardown cross-system thất bại → rác schema tích luỹ; setup pre-drop là lưới an toàn.
