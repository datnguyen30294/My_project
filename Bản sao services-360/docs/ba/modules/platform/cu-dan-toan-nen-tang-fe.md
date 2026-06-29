# Cư dân toàn nền tảng (Console Platform) — Đặc tả nghiệp vụ Frontend

> Module: Platform / Cư dân toàn nền tảng
> Ngày: 2026-06-20
> Trạng thái: Spec — chờ triển khai
> Nguồn dữ liệu: read model central (sync hằng ngày + nút "Đồng bộ ngay")
> Đặc tả BE: `cu-dan-toan-nen-tang-be.md`

---

## 1. Tổng quan

Trang quản lý **toàn bộ cư dân toàn nền tảng**, hợp nhất theo **số điện thoại**, kèm **toàn bộ đơn của cư dân** (phiếu dịch vụ OG ticket + đơn mua ở vendor) xuyên mọi tenant & vendor.

- **ĐỌC-CHỈ** — không tạo/sửa cư dân hay đơn. Hành động ghi duy nhất là **nút "Đồng bộ ngay"**.
- Dữ liệu là **ảnh chụp** từ lần đồng bộ gần nhất → luôn hiển thị nhãn *"Cập nhật lúc …"*.
- **Cờ đang-đồng-bộ**: khi bấm "Đồng bộ ngay", FE **chặn hiển thị dữ liệu** (overlay/skeleton) cho tới khi sync xong, rồi mới tải lại và hiển thị dữ liệu mới.

---

## 2. Danh sách trang

| Trang | Route | Mô tả |
|---|---|---|
| Danh sách cư dân | `/platform/quan-ly-van-hanh/cu-dan` | Bảng cư dân toàn nền tảng + thẻ tổng quan + thanh đồng bộ |
| Chi tiết cư dân | `/platform/quan-ly-van-hanh/cu-dan/[id]` | Danh tính + nơi xuất hiện + timeline đơn hợp nhất |

> Route kebab-case theo convention nhóm "quản lý vận hành". Thêm mục nav trong nhóm Platform tương ứng.

---

## 3. Trang danh sách

### 3.1 Thanh đồng bộ (đầu trang) — `useResidentSyncStatus`
| Thành phần | Dữ liệu | Ghi chú |
|---|---|---|
| Nhãn cập nhật | `last_synced_at` | "Cập nhật lúc 02:00, 20/06" (relative + tuyệt đối tooltip) |
| Badge trạng thái run | `latest_run.status` | `UBadge` color theo enum (running/success/failed) |
| Nút "Đồng bộ ngay" | — | `UButton` icon refresh; **disable + spinner** khi `is_syncing` |

### 3.2 Thẻ tổng quan (4 thẻ — `GET /residents/summary`)
| Thẻ | Dữ liệu |
|---|---|
| Tổng cư dân | `total_residents` |
| Tổng phiếu dịch vụ | `total_tickets` |
| Tổng đơn vendor | `total_vendor_orders` |
| Tổng chi tiêu vendor | `total_vendor_spent` (`formatCurrency`) |

### 3.3 Bảng cư dân (`GET /residents`)
| Cột | Dữ liệu | Ghi chú |
|---|---|---|
| Cư dân | `display_name` + `phone_normalized` | phone là khóa hợp nhất |
| Email | `email` | null → "—" |
| Số tenant | `tenant_count` | `UBadge` |
| Phiếu DV | `ticket_count` | |
| Đơn vendor | `vendor_order_count` | |
| Chi tiêu vendor | `vendor_total_spent` | `formatCurrency` |
| Gần nhất | `last_seen_at` | format ngày |
| (row click) | → chi tiết | |

### 3.4 Tìm kiếm & Lọc
| Bộ lọc | Loại | Mô tả |
|---|---|---|
| Tìm kiếm | input debounce (`useTableSearch`) | theo SĐT / tên |
| Nguồn | select | `source_system` (PMC / Resi Mart) |
| Có đơn vendor | toggle | `has_vendor_orders` |
| Sắp xếp | select | gần nhất / chi tiêu / số phiếu / tên |
| Phân trang | `UPagination` | `per_page` |

### 3.5 Hành động
| Hành động | Điều kiện | Kết quả |
|---|---|---|
| Bấm dòng | luôn | → trang chi tiết |
| Đồng bộ ngay | không `is_syncing` | POST sync → vào trạng thái đồng bộ (3.6) |

### 3.6 Trạng thái ĐỒNG BỘ (cờ chặn hiển thị) — **trọng tâm**
Luồng:
```
1. Mount trang → GET /residents/sync/status
   - is_syncing = true  → vào chế độ "đang đồng bộ" (chặn, poll)
   - is_syncing = false → tải summary + danh sách bình thường
2. Bấm "Đồng bộ ngay" → POST /residents/sync (202)
   - đặt cờ syncing = true → ẩn bảng + thẻ, hiện overlay "Đang đồng bộ dữ liệu cư dân…"
   - poll GET /residents/sync/status mỗi 4s
3. Khi latest_run.status:
   - success → tắt cờ → refresh summary + danh sách → hiện dữ liệu mới + toast "Đồng bộ xong"
   - failed  → tắt cờ → UAlert lỗi + nút "Thử lại"
```
- Trong lúc syncing: **không hiển thị dữ liệu cũ** (theo yêu cầu) — chỉ skeleton/overlay + thông điệp + (tùy chọn) số liệu tiến trình từ `latest_run.stats`.
- Poll bằng composable (`setTimeout`/`useIntervalFn`); dừng poll khi rời trang.

---

## 4. Trang chi tiết cư dân (read-only)

> `GET /residents/{id}` + `GET /residents/{id}/orders`.

### 4.1 Thông tin hiển thị
| Nhóm | Trường | Dữ liệu |
|---|---|---|
| Danh tính | Tên, SĐT, email | `display_name`, `phone_normalized`, `email` |
| Thống kê | phiếu / đơn / chi tiêu / mốc | `ticket_count`, `vendor_order_count`, `vendor_total_spent`, `first_seen_at`, `last_seen_at` |
| Xuất hiện ở đâu | bảng links | mỗi `link`: nguồn (`UBadge`), tên tenant/vendor, tên cục bộ, mã KH cục bộ |

### 4.2 Timeline đơn hợp nhất (`/residents/{id}/orders`)
| Cột | Dữ liệu | Ghi chú |
|---|---|---|
| Loại | `type.label` | `UBadge` (phiếu DV / sản phẩm / dịch vụ / hỗn hợp) |
| Mã / Tiêu đề | `code` ?? `title` | |
| Nơi | `vendor_name` ?? `tenant_name` + `project_name` | |
| Trạng thái | `status_group.label` | `UBadge` color theo nhóm |
| Giá trị | `total` | `formatCurrency`; ticket → "—" (total=0) |
| Thời điểm | `occurred_at` | sort giảm dần |
| Lọc | `type`, `status_group` | filter ở đầu bảng |

### 4.3 Hành động
| Hành động | Kết quả |
|---|---|
| Quay lại | → danh sách |
| Lọc đơn | gọi lại `/orders` với query |

> GĐ1 **không** mở chi tiết line-items từng đơn (đọc snapshot). Có thể bổ sung "xem chi tiết live ở nguồn" ở GĐ2.

---

## 5. Luồng người dùng

### 5.1 Xem & lọc danh sách
```
Vào trang → (nếu đang sync: chờ) → thấy thẻ tổng quan + bảng cư dân
→ gõ SĐT/tên hoặc lọc nguồn → bảng cập nhật → phân trang
```

### 5.2 Đồng bộ thủ công
```
Bấm "Đồng bộ ngay" → bảng ẩn, hiện "Đang đồng bộ…" + spinner
→ (poll) → xong → bảng hiện lại với dữ liệu mới + nhãn "Cập nhật lúc <giờ>"
```

### 5.3 Xem chi tiết
```
Bấm 1 cư dân → trang chi tiết → thấy nơi xuất hiện + timeline đơn (ticket + vendor)
→ lọc theo loại/trạng thái
```

### 5.4 Trạng thái tải / lỗi / rỗng
```
pending  → skeleton bảng / thẻ
error    → UAlert đỏ + nút thử lại
empty    → "Chưa có cư dân nào — bấm Đồng bộ ngay để nạp dữ liệu"
syncing  → overlay chặn (mục 3.6)
```

---

## 6. Component / API tái dùng (định hướng)

**Composable mới** `app/composables/api/usePlatformResidents.ts` (tất cả URL khai báo tại đây):
- `usePlatformResidentSummary()` — GET `/residents/summary`
- `usePlatformResidentList(params)` — GET `/residents`
- `usePlatformResidentDetail(id)` — GET `/residents/{id}`
- `usePlatformResidentOrders(id, params)` — GET `/residents/{id}/orders`
- `useResidentSyncStatus()` — GET `/residents/sync/status` (+ logic poll)
- `apiTriggerResidentSync()` — `$api` POST `/residents/sync`

**Components mới** `app/components/platform-resident/`:
- `ResidentSyncBar.vue` — nhãn cập nhật + badge + nút đồng bộ + overlay chặn
- `ResidentSummaryCards.vue` — 4 thẻ (tái dùng `SharedSectionCard`/`UPageCard`)
- `ResidentTable.vue` — bảng danh sách (`UTable`)
- `ResidentLinksPanel.vue` — bảng "xuất hiện ở đâu"
- `ResidentOrderTimeline.vue` — timeline đơn hợp nhất (`UTable` + filter)

**Tái dùng sẵn có:** `useTableSearch`, `UBadge`, `UButton`, `UTable`, `UAlert`, `UPagination`, `SharedSectionCard`, `formatCurrency`, util `rating.ts` (nếu hiện rating).

**Nav:** thêm mục "Cư dân toàn nền tảng" vào nhóm điều hướng Platform phù hợp.

---

## 7. Phân quyền
| Hành động | Quyền |
|---|---|
| Xem danh sách/chi tiết | Platform admin (`auth:requester`) |
| Đồng bộ ngay | Platform admin (cùng guard; BE kiểm tra trong `TriggerResidentSyncRequest::authorize`) |

---

## 8. Ghi chú nghiệp vụ
- Dữ liệu **không real-time**: là ảnh chụp lần sync gần nhất; luôn hiện nhãn "Cập nhật lúc …". Cần tươi ngay → bấm "Đồng bộ ngay".
- **Cờ đang-đồng-bộ** là yêu cầu cốt lõi: trong lúc sync **không hiển thị dữ liệu cũ**, chỉ overlay; xong mới render dữ liệu mới.
- Hợp nhất theo **SĐT chuẩn hóa** — nếu nguồn nhập SĐT khác nhau (`+84`/`0`) vẫn gộp đúng (BE chuẩn hóa).
- Cư dân không có SĐT ở nguồn sẽ **không** xuất hiện ở đây (BE skip) — GĐ1 chấp nhận.
- Đơn vendor "đã hủy" **không** tính vào "chi tiêu vendor".
- **GĐ2 (defer)**: mở chi tiết line-items đơn (live từ nguồn); lịch sử đồng bộ chi tiết; gộp/tách cư dân thủ công khi SĐT trùng nhưng khác người.
