# Định danh dự án toàn cục bằng `code` — Đặc tả nghiệp vụ Frontend

> Module: Console Platform (`residential-management`) + Storefront (`resi_mart`) | Ngày tạo: 2026-06-20 | Trạng thái: Draft

## 1. Tổng quan

Thay đổi FE đi kèm tính năng định danh dự án toàn cục (xem `dinh-danh-du-an-toan-cuc-be.md`):
- **Storefront resi_mart:** cư dân vào mua hàng qua link **chỉ mang `code` dự án** (không mang operator/tenant).
- **Console Platform residential-management:** danh sách "Đơn hàng vendor" hiển thị đúng CTVH và link dự án mở đúng trang.

Không có trang mới. Chỉ sửa hành vi 2 chỗ.

---

## 2. Console "Đơn hàng vendor" (residential-management)

Trang: `/platform/quan-ly-don-hang/don-hang-vendor`

### 2.1 Cột "Công ty VH"
| Hạng mục | Trước | Sau |
|----------|-------|-----|
| Hiển thị CTVH | Trống / "—" (do `tenant_id` null) | Hiện đúng tên CTVH (`tenant.name`), fallback `tenant.id` |

> Không đổi code FE cột này — nó đã đúng; chỉ cần BE/đơn có `tenant_id` (lo ở spec BE). Sau khi backfill + checkout ghi `tenant_id`, cột tự hiện.

### 2.2 Link cột "Dự án" (SỬA)
| Hạng mục | Trước | Sau |
|----------|-------|-----|
| Đích link | `/platform/quan-ly-van-hanh/du-an-tren-nen-tang/{project_id}` (thiếu tenant → lỗi "Không tìm thấy dự án") | `…/du-an-tren-nen-tang/{project_id}?tenant={tenant.id}` |
| Điều kiện render link | chỉ cần `project_id` | cần **cả** `project_id` **và** `tenant.id`; thiếu tenant → hiển thị text thường (không link) |

- File liên quan: `frontend/app/components/vendor-order/ConsoleTable.vue` (template `#project-cell`).
- Trang đích `du-an-tren-nen-tang/[id].vue` yêu cầu `?tenant=` (đọc `route.query.tenant`); nếu thiếu → coi như not-found. Vì vậy link bắt buộc kèm tenant.

### 2.3 Hành động
| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Click "Dự án" | Có `project_id` + `tenant.id` | Mở chi tiết dự án đúng CTVH |
| Click "Dự án" | Thiếu `tenant.id` | Không phải link (text thường) — tránh dẫn tới trang lỗi |

---

## 3. Storefront (resi_mart)

### 3.1 Ngữ cảnh dự án theo `code`
| Hạng mục | Trước | Sau |
|----------|-------|-----|
| Link cư dân | `?project=<id>&operator=<tenant_slug>` | `?project=<code>` (**chỉ code**) |
| Lọc catalog | theo `(tenant_id, project_id)` từ id + operator | resolve `code → (tenant, project)` rồi lọc như cũ |
| Header checkout | `X-Project-Id` + `X-Operator-Id` | `X-Project-Code` |

- File: `app/composables/useProjectContext.ts` (scope theo `code`), `app/composables/useCheckout.ts` (header `X-Project-Code`).

### 3.2 Luồng người dùng (storefront)
```
Cư dân mở link ?project=<code>
  → resi_mart resolve code → (tenant, project) [qua registry + kiểm vendor được gán]
      ✓ Hợp lệ: catalog lọc theo dự án; đặt đơn → đơn được gắn (tenant, project)
      ✗ Code sai / vendor không phục vụ dự án: catalog không giới hạn dự án;
        đơn KHÔNG gắn dự án (tenant=project=null) — không chặn mua
```

### 3.3 Quy tắc hiển thị
- Code không hợp lệ → **không báo lỗi cứng**, chỉ là không gắn phạm vi dự án (giữ hành vi "soft scope" hiện tại). Cân nhắc hiển thị nhẹ "Đang xem toàn bộ sản phẩm" nếu trước đó có ngữ cảnh dự án.

---

## 4. Ghi chú nghiệp vụ

- **Bất biến quan trọng:** trong đơn, `tenant` (CTVH) và `project` **luôn đi đôi** — có cả hai hoặc không có gì. Không bao giờ có đơn gắn project mà thiếu CTVH.
- **`code` là duy nhất toàn nền tảng** (BE enforce). Cư dân/vendor có thể yên tâm 1 `code` ⇒ đúng 1 dự án của đúng 1 CTVH.
- Phần cột "Công ty VH" và resolve tên dự án ở console là **kết quả tự nhiên** sau khi đơn có `tenant_id` — FE không cần thêm logic ngoài việc sửa link §2.2.
- Sau khi sửa, cần **verify trên browser**: (1) console hiện CTVH + click dự án ra đúng trang; (2) storefront mua bằng `?project=<code>` → đơn mới có CTVH trong console.
