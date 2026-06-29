# Năng lực nhân sự — Đặc tả nghiệp vụ Frontend

> Module: `Quản lý công việc / Năng lực nhân sự` | Ngày tạo: 2026-04-15 | Trạng thái: Draft

## 1. Tổng quan

Trang **"Năng lực nhân sự"** là công cụ của **điều phối viên** để xem nhanh trên 1 màn hình:

- Ai đang ở dự án nào.
- Đang gánh bao nhiêu việc (khảo sát + sửa chữa), trạng thái việc ra sao.
- Tải bao nhiêu % so với ngưỡng song song.
- Được cư dân chấm điểm bao nhiêu trung bình (điểm `resident_rating` trên ticket).

Trang **thuần read-only**: không tạo / sửa / xóa dữ liệu ở đây. Mọi thay đổi (phân công, đánh giá) xảy ra ở các màn hình khác.

## 2. Danh sách trang

| Trang | Route | Mô tả |
|-------|-------|-------|
| Năng lực nhân sự | `/quan-ly-cong-viec/nang-luc-nhan-su` | Danh sách + KPI tổng + bộ lọc |

> Trang này không có trang tạo/sửa/chi tiết riêng. Click vào 1 dòng → sang **hồ sơ nhân sự** (`/hrm/tai-khoan/{id}`) thuộc module HRM.

## 3. Trang danh sách

### 3.1 Khối KPI (5 ô, trên đầu trang)

Các ô KPI cập nhật theo **bộ lọc đang áp dụng** (dự án + search).

| Ô | Giá trị | Ghi chú |
|---|---------|---------|
| Nhân sự (theo bộ lọc) | `summary.staff_count` | Số nhân sự sau lọc |
| Đang xử lý | `summary.total_in_progress` | Tổng việc đang làm (màu hổ phách) |
| Chờ xử lý | `summary.total_pending` | Tổng việc đang chờ (màu primary) |
| TB % tải (ước lượng) | `summary.avg_load_percent` + `%` | Trung bình `load_percent` của các dòng |
| TB đánh giá (nhóm) | `summary.pooled_avg_rating` + `/ 5` | Kèm dòng phụ: `{total_rating_events} lượt · {staff_with_ratings} nhân sự có điểm`. Nếu chưa có lượt → hiển thị `—` |

### 3.2 Khối cảnh báo "Cách đọc bảng" (trên KPI)

- Dùng `<UAlert color="neutral" variant="subtle" icon="i-lucide-gauge">` với nội dung mô tả cách tính:
  `"Khối lượng từ phân công (khảo sát / sửa chữa). % tải = (chờ + đang làm) / {parallel_capacity} việc song song (mock). ĐTB đánh giá: điểm cư dân chấm trên ticket, thang 1–5."`
- `{parallel_capacity}` lấy từ `summary.parallel_capacity` trả về.

### 3.3 Bộ lọc (trên header bảng)

| Bộ lọc | Loại | Mô tả |
|--------|------|-------|
| Dự án | `USelect` | Item đầu tiên `{ value: null, label: "Tất cả dự án" }`. Dưới là danh sách dự án active. Khi thay đổi, gọi API với `project_id` tương ứng |
| Tìm nhân sự | `UInput` + icon `i-lucide-search` | Placeholder `"Tên hoặc mã NV..."`. **Debounce 300ms** rồi mới gọi API với `search` |

### 3.4 Bảng danh sách

Dùng `<UTable>` của Nuxt UI. Cột:

| Cột | Dữ liệu | Ghi chú / Format |
|-----|---------|------------------|
| Nhân sự | `full_name` + `employee_code` | 2 dòng: tên đậm, mã phụ nhỏ màu muted |
| Chức danh | `job_title_name` | Text thuần, `—` nếu rỗng |
| Dự án | `project_names` | Nối bằng `, `. `—` nếu rỗng. Giới hạn hiển thị `max-w-[200px]`, wrap |
| Khảo sát / Sửa chữa | `survey_count / repair_count` | VD: `3 / 5` |
| Chờ | `pending` | Số thuần |
| Đang làm | `in_progress` | Số thuần |
| Xong | `completed` | Số thuần |
| ĐTB đánh giá | `avg_rating` + `/ 5 · {rating_count} lượt` | Nếu `avg_rating == null` → `—` |
| Tải | `load_percent` | Thanh progress ngang (bar width = `load_percent%`) + số `%` bên phải |
| (link) | — | Nút `UButton variant="link" size="xs"` label `Hồ sơ` → `/hrm/tai-khoan/{account_id}` |

### 3.5 Phụ thông tin (dưới bảng)

- Dòng text nhỏ: `"Đã hoàn thành (tổng trong mock): {summary.total_completed} phân công."` + link tới **Lịch việc đội** và **Lịch việc cá nhân**.

### 3.6 Tìm kiếm & Lọc — hành vi

- Filter `project_id` + `search` đều gửi tới BE qua query params.
- FE **không** tự lọc lại phía client sau khi BE trả. KPI từ BE đã tính theo bộ lọc.
- Nếu chưa chọn dự án + search rỗng → gọi API không query param → trả toàn bộ nhân sự active.
- `project_id = null` (item "Tất cả dự án") → omit param khỏi URL, không gửi chuỗi rỗng.

### 3.7 Hành động trên bảng

| Hành động | Điều kiện | Kết quả |
|-----------|-----------|---------|
| Xem hồ sơ nhân sự | Luôn hiển thị | Chuyển sang `/hrm/tai-khoan/{account_id}` |
| (không có) tạo/sửa/xóa | — | Trang read-only |

## 4. Form tạo mới / chỉnh sửa

Không áp dụng — trang read-only.

## 5. Trang chi tiết

Không áp dụng — click vào nhân sự sẽ mở **hồ sơ nhân sự** ở module HRM (spec riêng: `docs/ba/modules/hrm/account-fe.md`).

## 6. Luồng người dùng

### 6.1 Xem toàn bộ nhân sự

```
Mở trang → hiển thị toàn bộ nhân sự active
  ✓ KPI tổng sát
  ✓ Bảng sort theo tên
```

### 6.2 Lọc theo dự án

```
Mở dropdown "Dự án" → chọn 1 dự án
  → API trả chỉ nhân sự thuộc dự án (pivot account_projects)
  → KPI tổng được tính lại trên tập lọc
```

### 6.3 Tìm nhân sự

```
Gõ vào ô "Tìm nhân sự" → debounce 300ms
  → API trả các dòng khớp tên / mã / chức danh
  → KPI tổng được tính lại trên tập lọc
  ✗ Lỗi 422 (search > 100 ký tự): hiển thị toast "Từ khóa tối đa 100 ký tự"
```

### 6.4 Kết hợp lọc dự án + search

```
Chọn dự án → gõ search → kết quả giao giữa 2 điều kiện
```

### 6.5 Mở hồ sơ

```
Click "Hồ sơ" trên 1 dòng → chuyển /hrm/tai-khoan/{id}
```

### 6.6 Lỗi

```
Request fail (500): hiển thị UAlert color="error" trong vùng bảng,
  kèm nút "Thử lại" gọi refresh()
422 (quá nhiều nhân sự): hiển thị UAlert color="warning" gợi ý lọc dự án
```

## 7. Phân quyền

| Hành động | Quyền cần có | Ghi chú |
|-----------|-------------|---------|
| Xem trang | `workforce.capacity.view` | Mặc định cho vai điều phối, quản lý, admin |
| Mở hồ sơ nhân sự | `hrm.account.view` | Quyền của HRM |

> Nếu không có quyền `workforce.capacity.view`: middleware route redirect về dashboard, hiển thị toast `"Bạn không có quyền xem Năng lực nhân sự."`.

## 8. Trạng thái UI

| Trạng thái | Hiển thị |
|-----------|---------|
| Loading lần đầu | Skeleton 5 ô KPI + skeleton table 10 dòng |
| Loading khi đổi filter | Ô KPI giữ giá trị cũ, overlay opacity 60% + spinner; bảng overlay spinner |
| Empty (không có nhân sự) | `<UAlert color="neutral">` `"Không có nhân sự khớp bộ lọc."` |
| Error | `<UAlert color="error">` + nút `"Thử lại"` |

## 9. Ghi chú nghiệp vụ

- **Không hiển thị** nhân sự `active = false` (đã lọc ở BE). Nếu cần xem nhân sự nghỉ việc có điểm cũ, dùng báo cáo riêng (future).
- **1 ticket nhiều assignee**: cả hai nhân sự đều được đếm đủ count và cùng chia sẻ điểm đánh giá (không chia đôi).
- **Không có quyền sửa `parallel_capacity`** trên UI — cấu hình do admin BE (config file). Hiện thị số hiện tại qua KPI-help alert.
- Click vào **mã nhân viên** hoặc **tên** có thể mở hồ sơ (shortcut tương đương nút "Hồ sơ").
- Khi 1 nhân sự `rating_count = 0` → cột ĐTB hiển thị `—`. Không đưa giá trị `0` hoặc `N/A` gây nhiễu khi sort.
- Sort cột: v1 chỉ sort theo tên (server-side). Các cột số (tải, đang làm, ĐTB) **chưa sort client**. Nếu user cần, ra v2.

## 10. Tương tác với các màn hình khác

| Từ màn hình | Qua trang này | Sang màn hình |
|-------------|----------------|----------------|
| Dashboard điều phối | — | Trang Năng lực nhân sự |
| Trang này | Click "Hồ sơ" | HRM / chi tiết tài khoản |
| Trang này | Link chân trang | Lịch việc đội / Lịch việc cá nhân |
| Chi tiết ticket (đánh giá) | — | Nguồn duy nhất của điểm `resident_rating` trả về trong row |

## 11. Code reuse (FE)

- API composable: `useWorkforce.ts` đặt tại `app/composables/api/` với function `useWorkforceCapacityList({ projectId, search })` dùng `useApiFetch`.
- Dropdown dự án: **dùng chung** composable hoặc `useProjects.ts` đã có (`useProjectList()`), KHÔNG fetch riêng.
- Debounce search: dùng `useTableSearch.ts` đã có trong `app/composables/`.
- Constants: `PARALLEL_CAPACITY_LABEL` (nếu cần) đặt trong `useWorkforce.ts`, không hardcode trong page.
- Không tự viết `<div>` + Tailwind cho alert / card / badge — dùng `UAlert`, `UCard`, `UBadge`, `SharedSectionCard` đã có.

## Tài liệu liên quan

- [Năng lực nhân sự — BE spec](./nang-luc-nhan-su-be.md)
- [Lịch việc đội — FE spec](../hrm/schedule-view-fe.md)
- [Lịch việc cá nhân — FE spec](../hrm/schedule-view-fe.md)
- [HRM / Tài khoản — FE spec](../hrm/account-fe.md)
- Mockup tham chiếu: `BA-TNP-SERVICES/app/pages/modules/quan-ly-cong-viec/nang-luc-nhan-su.vue`
