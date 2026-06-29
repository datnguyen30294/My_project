# Đánh giá của cư dân (tenant) - Đặc tả kỹ thuật Backend

> Module: `Platform/Tenant` (consumer) + `PMC/OgTicket` (owner) | Ngày tạo: 2026-06-12 | Trạng thái: **Hoàn thành**
> Nguồn: mockup `BA-TNP-SERVICES/.../cong-ty-vh/[companyId].vue` — Card "Đánh giá của cư dân" + cột "Đánh giá CD" trang danh sách.
> Phần còn lại của Phase 3 trong `cong-ty-van-hanh-be.md` (mục Gap #7).

## 1. Tổng quan

Tổng hợp đánh giá của cư dân trên các **ticket** trong tenant schema (không phải đơn vendor resi_mart như bản nháp đầu — đã xác nhận lại nghiệp vụ), hiển thị ở trang chi tiết công ty vận hành phía platform: điểm trung bình, số lượt, và bảng chi tiết từng đánh giá.

Dữ liệu rating đã tồn tại sẵn: cư dân đánh giá ticket qua cổng resident → ghi vào `og_tickets.resident_rating`, `resident_rating_comment`, `resident_rated_at` (xem `TicketRatingTest`). Không có blocker.

## 2. Entities

**Không có bảng mới.** Đọc read-only từ `OgTicket` (tenant schema, qua `$tenant->run()`): `ticket_id`, `subject`, `project_id`, `customer_id`, `requester_name`, `resident_rating`, `resident_rating_comment`, `resident_rated_at`. Mã ticket lấy từ bảng `tickets` central theo `ticket_id`.

## 3. Enums

Không có enum mới.

## 4. API Endpoints

| Action | Method | URL | Request Class |
|--------|--------|-----|---------------|
| Danh sách đánh giá | GET | `/platform/tenants/{id}/resident-ratings` | `ListTenantResidentRatingRequest` |

Response kèm `summary` (avg + count) trong cùng endpoint để FE không phải gọi 2 lần.

## 5. Validation Rules

### ListTenantResidentRatingRequest

| Field | Rules | Message (VI) |
|-------|-------|-------------|
| `per_page` | nullable, integer, min:1, max:100 | |
| `page` | nullable, integer, min:1 | |
| `rating` | nullable, integer, min:1, max:5 | Lọc theo số sao |

## 6. Business Rules

- [x] Chỉ lấy ticket có `resident_rating` không null (cư dân chỉ đánh giá được ticket đã hoàn tất — rule phía cổng resident).
- [x] Sắp xếp `resident_rated_at` DESC (mới nhất trước).
- [x] `summary.average` làm tròn 1 chữ số thập phân; `summary.count` = tổng lượt đánh giá (không phụ thuộc filter `rating`).
- [x] Cùng DB (tenant schema switch qua `$tenant->run()`) — KHÔNG cần `data_available` như cross-DB resi_mart.
- [x] **Cột "Đánh giá CD" trên trang danh sách tenants** (mockup có): KHÔNG làm ở giai đoạn này — N+1 tenant-schema switch per row. Chỉ hiển thị ở trang chi tiết.
- [x] Không lộ thông tin nhạy cảm của cư dân: chỉ tên hiển thị (`customer.full_name`, fallback `requester_name`), không SĐT/địa chỉ.
- [x] Tenant inactive vẫn xem được (dữ liệu lịch sử, giống tenants/{id}/projects).

## 7. Response Output

```json
{
  "success": true,
  "summary": { "average": 4.6, "count": 23 },
  "data": [
    {
      "ticket_id": 12,
      "ticket_code": "TK-2026-012",
      "subject": "Sửa điều hoà",
      "project_name": "Chung cư Alpha Tower",
      "resident_name": "Trần Thị B",
      "rating": 5,
      "comment": "Giao nhanh, nhân viên thân thiện",
      "rated_at": "2026-05-20T10:00:00+07:00"
    }
  ],
  "meta": { "current_page": 1, "per_page": 20, "total": 23 }
}
```

> - Mockup có cột "Vendor" và "Loại" (Sản phẩm / Dịch vụ) — thuộc bản nháp nguồn resi_mart, KHÔNG áp dụng cho nguồn ticket. Bỏ.
> - Mockup có link sang trang đơn — với nguồn ticket, trả `ticket_id` + `ticket_code`; platform hiện chưa có trang chi tiết ticket vận hành nên FE hiển thị text thuần.

## 8. Cross-Module Dependencies (ExternalService)

| Dependency | Module nguồn (owner) | Interface | Method |
|-----------|---------------------|-----------|--------|
| Đánh giá trên ticket | PMC/OgTicket | `TenantResidentRatingExternalServiceInterface` | `getRatingsForTenant(Organization $tenant, array $filters): array` — trả `{summary: {average, count}, paginator}` trong MỘT call |

- Vị trí: `PMC/src/OgTicket/ExternalServices/Platform/TenantResidentRatingExternalService.php`, binding `PMCServiceProvider`.
- Gộp summary + danh sách vào một method/call trong cùng một `$tenant->run()`; `summary` tính trên toàn bộ đánh giá (không áp filter `rating`).
- Mã ticket batch-load từ bảng `tickets` central (`Ticket::whereIn('id', ...)->pluck('code', 'id')`) — pattern `getTicketCodes` hiện có.
- Pattern giống `TenantProjectExternalService` (tenants/{id}/projects).

## 9. Migration Preview

Không có migration mới — các cột rating đã tồn tại trên `og_tickets`.

## 10. Checklist triển khai BE

- [x] ~~(BLOCKER) resi_mart~~ — không còn: nguồn là ticket nội bộ, dữ liệu rating đã có
- [x] `TenantResidentRatingExternalServiceInterface` + impl + binding `PMCServiceProvider`
- [x] Controller + `ListTenantResidentRatingRequest` + `TenantResidentRatingResource` trong Platform/Tenant
- [x] Route `GET /platform/tenants/{id}/resident-ratings` (`external-api.php`, auth:requester)
- [x] Factory state `OgTicketFactory::rated()`
- [x] Tests (`TenantResidentRatingListingTest`): list + sort + summary, không có đánh giá, filter rating (summary không đổi), validation rating, pagination, privacy (không lộ SĐT), fallback requester_name, soft-deleted, tenant inactive, tenant 404, 401
- [x] `make format` → `make lint` → tests; cập nhật `api.json`
