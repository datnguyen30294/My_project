# Tổng hợp yêu cầu - Meeting 27/03/2026

> Tổng hợp từ notes meeting, kiểm tra trạng thái implement trong codebase.

## Ký hiệu trạng thái

| Icon | Nghĩa |
|------|--------|
| ✅ | Đã implement đúng |
| ⚠️ | Đã implement nhưng chưa đầy đủ / cần review |
| ❌ | Chưa implement |
| 🔄 | Đang implement dở / có code nhưng chưa hoàn chỉnh |

---

## 1. Danh mục hàng (Catalog)

| # | Yêu cầu | Trạng thái | Chi tiết / Giải pháp |
|---|---------|------------|----------------------|
| 1.1 | Chiết khấu (%) → đổi tên thành **Hoa Hồng** | ✅ Done | FE đã hiển thị `Hoa Hồng (%)` trong cột table (`catalog/items/index.vue:113`, `catalog/suppliers/index.vue:60`) |
| 1.2 | Xoá tab "Tất cả" | ✅ Done | Chỉ còn 3 tab: Vật tư, Dịch vụ, Dịch vụ tùy chọn (`catalog/items/index.vue:15-19`) |
| 1.3 | Thêm cột **giá mua** (purchase_price) | ✅ Done | BE model CatalogItem có `purchase_price` (decimal:2). Migration `2026_03_28_094908` đã thêm field. |
| 1.4 | Cột chiết khấu vật tư không điền → **kế thừa từ nhà cung cấp** | ✅ Done | `CatalogItemService::fillCommissionRateFromSupplier()` tự fill `commission_rate` từ supplier nếu item để trống. |
| 1.5 | Thêm **category, description** cho dịch vụ | ✅ Done | CatalogItem có `service_category_id` (bắt buộc cho type=service) và `description` field. |
| 1.6 | Thêm **ảnh** cho danh mục (ServiceCategory) | ✅ Done | ServiceCategory có `image_path`, controller có endpoint upload ảnh. |
| 1.7 | Thêm **tạo nhanh danh mục** ngay trong báo giá | ✅ Done | `QuoteLineFormModal.vue` có modal tạo catalog item inline khi đang thêm dòng báo giá. |
| 1.8 | **Breadcrumb** danh mục bị sai | ⚠️ Cần kiểm tra | Có `useBreadcrumb()` trong `catalog/categories/[id].vue` và `catalog/suppliers/[id].vue`. Cần xác nhận đường dẫn breadcrumb có đúng không trên UI. |
| 1.9 | Danh mục, vật tư **có thể chọn dự án** | ❌ Chưa implement | CatalogItem và ServiceCategory không có `project_id`. Hiện là tenant-wide. **Giải pháp**: Thêm `project_id` (nullable) vào `catalog_items` và `service_categories`, lọc theo dự án khi cần. |
| 1.10 | Dịch vụ cần load ra **màn user**, có cờ bật tắt | ❌ Chưa implement | `PublicServiceController` có API public nhưng không có cờ per-company visibility. **Giải pháp**: Thêm flag `is_visible_public` hoặc sử dụng `status` field để kiểm soát hiển thị ra ngoài. |
| 1.11 | **Update ảnh** cho dịch vụ (CatalogItem) | ✅ Done | CatalogItem có `image_path` + endpoint upload ảnh. |

---

## 2. Hoa hồng (Commission)

| # | Yêu cầu | Trạng thái | Chi tiết / Giải pháp |
|---|---------|------------|----------------------|
| 2.1 | **Platform (%)**: disable không cho đổi | ✅ Done | FE hiển thị platform config dạng read-only (gray box), ghi chú "không chỉnh được — lấy từ platform service". |
| 2.2 | Phân bổ hoa hồng tổng 100% + **thêm cả số tiền** | ✅ Done | `CommissionValueType` enum hỗ trợ: `percent`, `fixed`, `both`. BE validate tổng % = 100% ở mỗi cấp. FE hiển thị cả % và tiền cứng. |
| 2.3 | **Validate tiền cứng theo cấp bậc**: nút con tổng fix ≤ nút cha | ✅ Done | `SaveCommissionConfigRequest` validate: dept total fixed ≤ management fixed, staff total fixed ≤ dept fixed. |
| 2.4 | **100% + số tiền fix cứng bậc 1** (VD: 400k = 100%(300k) + 100k fix) | ✅ Done | Mô hình phân phối: Platform trừ trước (fixed + %), sau đó các party chia theo % + fixed. FE có preview mindmap minh hoạ. |
| 2.5 | % và/hoặc **tiền cứng đ/đơn** (giống phòng ban) | ✅ Done | `CommissionValueType::Both` cho phép cả % và tiền cứng cùng lúc ở mọi cấp (party/dept/staff). |
| 2.6 | Có set theo **từng dự án** không? | ✅ Done | `ProjectCommissionConfig` — mỗi project có 1 config riêng. |
| 2.7 | **Override đơn hàng**: điền tiền fix cứng, tổng = dịch vụ đơn hàng (platform ko cho sửa) | ✅ Done | `OrderCommissionOverride` model. Validate: tổng override = commissionable_total - platform_amount. Platform không cho sửa (tách riêng). |
| 2.8 | Cài đặt **thời gian tối đa kì chốt phí** | ❌ Chưa implement | Không có setting `commission_closing_period` trong SystemSetting. **Giải pháp**: Thêm setting group `commission` với key `max_closing_period_days`. |
| 2.9 | Khóa chỉnh sửa đơn + quy tắc công nợ | ❌ Chưa implement | Hiện chỉ có OrderStatus state machine (Draft→Confirmed→InProgress→Completed). Chưa có logic: (1) thu hết công nợ mới vào kì chốt, (2) đơn completed + thu hết mới chốt, (3) chỉ mở lại khi chưa thanh toán hoa hồng. **Giải pháp**: Cần thêm module Payment/Debt tracking. |
| 2.10 | Đã chốt tiền → mở lại chỉ khi **chưa thanh toán hoa hồng** | ❌ Chưa implement | Chưa có commission settlement/payout tracking. **Giải pháp**: Cần CommissionSettlement model. |

---

## 3. Báo giá (Quote)

| # | Yêu cầu | Trạng thái | Chi tiết / Giải pháp |
|---|---------|------------|----------------------|
| 3.1 | Nếu **override báo giá** → thêm dòng báo giá form cũ | ✅ Done | (Marked done trong notes) QuoteLine cho phép override `unit_price` khác giá gốc catalog. |
| 3.2 | Dịch vụ + tùy chọn **validate theo giá chiết khấu dự án** | ✅ Done | `QuoteService::validateServiceAmountAgainstCommission()` — tổng service+adhoc ≥ tổng commission fixed của project. |
| 3.3 | Báo giá: **có email thì gửi, không thì thôi** | ❌ Chưa implement | Không có logic gửi email trong QuoteService. **Giải pháp**: Thêm email field (optional) trên OgTicket/Quote, tạo QuoteEmailNotification gửi khi transition → Sent. |
| 3.4 | Giới hạn **tối đa tạo báo giá** | ❌ Chưa implement | Hiện cho tạo unlimited quote versions. **Giải pháp**: Thêm setting `og_ticket.max_quote_versions` và validate trong QuoteService::create(). |

---

## 4. OG Ticket (Phiếu dịch vụ)

| # | Yêu cầu | Trạng thái | Chi tiết / Giải pháp |
|---|---------|------------|----------------------|
| 4.1 | Thêm input **email** (optional) | ❌ Chưa implement | OgTicket chỉ có `requester_phone`. **Giải pháp**: Thêm `requester_email` (nullable, email validation) vào model + migration. |
| 4.2 | **ODA Zalo** (optional) | ❌ Chưa implement | Không có field zalo. **Giải pháp**: Thêm `requester_zalo` (nullable string) vào model. |
| 4.3 | **Bắt buộc chọn dự án** | ❌ Chưa implement | `project_id` nullable trong model và validation. **Giải pháp**: Đổi validation thành `required` trong UpdateOgTicketRequest. |
| 4.4 | Ticket theo **danh mục và category theo từng dự án** | ❌ Chưa implement | Không có liên kết ticket ↔ category, và category không có project scope. **Giải pháp**: Thêm `service_category_id` lên OgTicket, category cần project scope. |
| 4.5 | Giai đoạn xử lý: **chưa đi qua phân công thì không hiện** | ⚠️ Cần kiểm tra FE | BE lifecycle có tracking segment theo status, FE có stepper component. Cần verify: nếu ticket chưa qua `Assigned` thì các step sau có bị ẩn không. Hiện tại FE hiển thị tất cả steps. **Giải pháp**: FE stepper chỉ render step đến status hiện tại + 1. |
| 4.6 | **Tiến trình history** báo giá, đơn hàng chi tiết | ⚠️ Partially done | Có Audit trail cho Quote và Order (audits endpoint). Nhưng chưa có timeline/history view chuyên biệt trên FE cho progress tracking. **Giải pháp**: Thêm timeline component hiển thị audit + lifecycle segments. |
| 4.7 | Cờ **check bảo hành** + note | ❌ Chưa implement | Không có field `is_warranty`, `warranty_note` trên OgTicket. **Giải pháp**: Thêm `is_warranty` (boolean default false) + `warranty_note` (text nullable). |
| 4.8 | **Cài đặt bảo hành**: thời hạn bảo hành (default hoặc theo og ticket) | ❌ Chưa implement | Không có setting bảo hành. **Giải pháp**: Thêm setting `warranty.default_duration_days` + optional `warranty_expires_at` trên OgTicket. |
| 4.9 | Cơ chế **auto nhận ticket** | ❌ Chưa implement | Chỉ có auto-release (stale ticket sau 60 phút). Không có auto-assign. **Giải pháp**: Cần rule engine: round-robin, load-based, hoặc skill-based assignment. |
| 4.10 | **SLA Báo giá** → đánh giá người tiếp nhận | ✅ Done | `sla_quote_due_at` được set khi claim ticket. Setting `og_ticket.sla_quote_minutes` (default 60 phút). FE hiển thị violation warning. |
| 4.11 | **SLA Hoàn thành** → đánh giá người được phân công | ✅ Done | `sla_completion_due_at` set khi transition → Approved. Setting `og_ticket.sla_completion_minutes` (default 1440 phút). FE hiển thị violation. |
| 4.12 | OG ticket cũng có SLA riêng (ngoài cài đặt hệ thống) | ✅ Done | OgTicket model có `sla_quote_due_at` và `sla_completion_due_at` — cho phép override per-ticket. |
| 4.13 | **Vào tiếp nhận → báo giá luôn**, sau đó mới phân công | ⚠️ Workflow khác | Hiện tại: Received → Assigned → Surveying → Quoted. Yêu cầu: Received → Quoted (bỏ qua assigned/surveying nếu cần). **Giải pháp**: Cho phép transition trực tiếp Received → Quoted khi tạo báo giá. |
| 4.14 | **Đã phân công thì không quay lại**, chỉ sửa người | ⚠️ Chưa đúng | Hiện tại cho phép backtrack từ Quoted → Assigned. Yêu cầu: Assigned là irreversible, chỉ cho sửa assignee. **Giải pháp**: Lock backtrack từ Assigned, chỉ allow update assignee list. |
| 4.15 | **Avatar** vào phân công | ✅ Done | `LifecycleStepper.vue` hiển thị avatar tại step "assigned" — nhận `currentAssignees` với `avatar_url`, render `<img>` thay icon mặc định. |
| 4.16 | **Thời gian làm** và **thời gian từ khi có đơn hàng** | ❌ Chưa implement | Lifecycle segments track started_at/ended_at nhưng chưa có computed working time. **Giải pháp**: Tính duration từ lifecycle segments. |
| 4.17 | Từ đơn hàng → báo giá (cư dân chấp thuận mới phát sinh số lần thực hiện) | ⚠️ Cần clarify | Hiện có cycle tracking trong lifecycle segments. Cần xác nhận: "số lần thực hiện" = cycle count hay execution count? |

---

## 5. Đơn hàng (Order)

| # | Yêu cầu | Trạng thái | Chi tiết / Giải pháp |
|---|---------|------------|----------------------|
| 5.1 | Dòng đơn hàng **cho phép sửa** | ❌ Chưa implement | OrderLine hiện read-only, copy từ Quote. **Giải pháp**: Cho phép edit OrderLine khi Order ở Draft/Confirmed status. Cần thêm UpdateOrderLineRequest + logic trong OrderService. |
| 5.2 | Cho phép **override commission** trong đơn hàng | ✅ Done | `OrderCommissionOverride` model + controller + service đầy đủ. ACL qua CommissionAdjuster. |
| 5.3 | **Không huỷ đơn** | ❌ Chưa đúng | OrderStatus hiện có `Cancelled` và cho phép cancel từ Draft/Confirmed/InProgress. **Giải pháp**: Xoá Cancelled khỏi allowed transitions (hoặc restrict điều kiện cancel rất chặt). |
| 5.4 | Khóa chỉnh sửa đơn: cần **hoàn thành hết công nợ phải thu** | ❌ Chưa implement | Chưa có payment/debt tracking module. **Giải pháp**: Cần module Payment để track công nợ. |

---

## 6. Cài đặt hệ thống (System Settings)

| # | Yêu cầu | Trạng thái | Chi tiết / Giải pháp |
|---|---------|------------|----------------------|
| 6.1 | **SLA Báo giá** (setting) | ✅ Done | `og_ticket.sla_quote_minutes` (default 60). FE settings page có form edit. |
| 6.2 | **SLA Hoàn thành** (setting) | ✅ Done | `og_ticket.sla_completion_minutes` (default 1440). FE settings page có form edit. |
| 6.3 | **Thời gian tối đa kì chốt phí** | ❌ Chưa implement | Không có setting commission closing period. **Giải pháp**: Thêm setting group `commission`. |
| 6.4 | **Cài đặt bảo hành** (default duration) | ❌ Chưa implement | **Giải pháp**: Thêm setting group `warranty` với key `default_duration_days`. |

---

## 7. HRM / Nhân sự

| # | Yêu cầu | Trạng thái | Chi tiết / Giải pháp |
|---|---------|------------|----------------------|
| 7.1 | 1 acc **thuộc nhiều phòng ban** | ❌ Chưa implement | Account hiện có single `department_id` (BelongsTo). **Giải pháp**: Chuyển sang many-to-many qua pivot table `account_department`. Cần refactor: Account model, migration, commission dept rules. |

---

## 8. Rating / Đánh giá

| # | Yêu cầu | Trạng thái | Chi tiết / Giải pháp |
|---|---------|------------|----------------------|
| 8.1 | **Rating cho toàn bộ**, lưu ở Platform | ✅ Done | Platform Ticket model có `resident_rating`, `resident_rating_comment`, `resident_rated_at`. Public endpoint `/api/platform/tickets/{code}/rating`. Rating sync về OgTicket. |
| 8.2 | **SLA Báo giá → đánh giá người tiếp nhận** | ⚠️ Partially | SLA tracking có, nhưng chưa có report/scoring cho từng nhân viên dựa trên SLA compliance. **Giải pháp**: Tạo report aggregation từ lifecycle segments. |
| 8.3 | **SLA Hoàn thành → đánh giá người phân công** | ⚠️ Partially | Tương tự 8.2 — SLA data có nhưng chưa có performance report. |

---

## 9. Platform / Hạ tầng

| # | Yêu cầu | Trạng thái | Chi tiết / Giải pháp |
|---|---------|------------|----------------------|
| 9.1 | **External API** riêng | ✅ Done | Module ExternalApi với ExtAccountController, ExtDepartmentController, etc. Middleware AuthenticateApiClient + CheckApiScope. |
| 9.2 | **API Clients**: pub/secret, JWT | ✅ Done | ApiClient model (UUID, client_key, encrypted_secret, scopes). Hỗ trợ regenerate secret. |
| 9.3 | **Customers**: địa chỉ, đơn hàng | ✅ Done | Platform Customer model (name, phone, address). Linked to Ticket. Đơn hàng truy cập qua Ticket → OgTicket → Quote → Order. |
| 9.4 | Cty vận hành khác nhau có **dịch vụ khác nhau** ngoài giao diện user | ✅ Done | Multi-tenancy (database-per-tenant) đảm bảo mỗi tenant có catalog riêng. |
| 9.5 | **Blog cho dịch vụ** | ❌ Chưa implement | Không có blog/content module. **Giải pháp**: Cần CMS module hoặc rich text content cho CatalogItem. |

---

## Tóm tắt tổng quan

| Nhóm | Tổng | ✅ Done | ⚠️ Partial | ❌ Chưa |
|------|------|---------|-----------|--------|
| Danh mục (Catalog) | 11 | 8 | 1 | 2 |
| Hoa hồng (Commission) | 10 | 7 | 0 | 3 |
| Báo giá (Quote) | 4 | 2 | 0 | 2 |
| OG Ticket | 17 | 4 | 5 | 8 |
| Đơn hàng (Order) | 4 | 1 | 0 | 3 |
| Cài đặt (Settings) | 4 | 2 | 0 | 2 |
| HRM | 1 | 0 | 0 | 1 |
| Rating | 3 | 1 | 2 | 0 |
| Platform | 5 | 4 | 0 | 1 |
| **TỔNG** | **59** | **29** | **8** | **22** |

---

## Ưu tiên triển khai (đề xuất)

### Urgent (theo notes)
1. ~~Cty vận hành khác nhau có dịch vụ khác nhau~~ ✅ Done
2. ~~Override báo giá + dòng form cũ~~ ✅ Done
3. ~~Validate dịch vụ + tùy chọn theo giá chiết khấu dự án~~ ✅ Done
4. ~~Thêm giá mua/giá bán vật tư~~ ✅ Done
5. ~~Chiết khấu → Hoa Hồng~~ ✅ Done
6. ~~Thêm ảnh cho danh mục~~ ✅ Done
7. ~~Thêm tạo nhanh danh mục trong báo giá~~ ✅ Done

### Ưu tiên 1 — OG Ticket & Order
- 4.1: Email field trên ticket
- 4.3: Bắt buộc dự án
- 4.7: Cờ bảo hành + note
- 4.5: Giai đoạn xử lý ẩn nếu chưa qua phân công  
- 4.15: ~~Avatar vào phân công~~ ✅ Done (LifecycleStepper.vue)
- 5.1: Cho phép sửa dòng đơn hàng
- 5.3: Xử lý không cho huỷ đơn

### Ưu tiên 2 — HRM
- 7.1: Account nhiều phòng ban (impact lớn — refactor commission)

### Ưu tiên 3 — Commission & Settings
- 2.8: Setting thời gian kì chốt phí
- 2.9-2.10: Khoá đơn + công nợ + settlement
- 6.3-6.4: Settings bảo hành, commission period

### Tương lai
- 4.9: Auto-assignment
- 9.5: Blog cho dịch vụ
- 3.4: Giới hạn tạo báo giá
