# Các màn record cố định (chỉ update, không tạo mới)

Một số màn hiển thị **record cố định** (fixed set) — không có route `POST` để tạo, chỉ có `PUT` / `PATCH` để cập nhật giá trị. Nếu seeder chưa chạy, màn sẽ **rỗng** cho tới khi ai đó PUT lần đầu.

## `/pmc/policies` — Chính sách

Entity: `App\Modules\PMC\Policy\Models\Policy`. Có **3 type cố định** (enum `PolicyType`): thường là `Privacy`, `Terms`, `Refund` (kiểm tra enum để xác định chính xác).

### Entry points

- **Read**: `GET /policies` — `app/Modules/PMC/routes/api.php:160` — trả toàn bộ 3 type.
- **Detail**: `GET /policies/{type}` — lookup theo type value.
- **Update**: `PUT /policies/{type}` — update-or-create theo type. **Đây là cách duy nhất** để sinh record nếu seeder chưa chạy.
- **Upload image trong content**: `POST /policies/upload-image` — upload ảnh qua `StorageService`, trả URL để admin chèn vào `content_html`.
- **Seeder**: `PolicySeeder` (chạy khi setup tenant) tạo sẵn 3 record với nội dung mẫu.

Không thể có `PolicyType` thứ 4 nếu không extend enum + migration.

## `/pmc/settings` — Cài đặt hệ thống

Entity: `App\Modules\PMC\Setting\Models\SystemSetting`. Tổ chức theo `group` + `key`.

### Entry points

- **Read theo group**: `GET /settings/{group}` — trả toàn bộ key/value của group.
- **Update theo group**: `PUT /settings/{group}` — update-or-create từng key. Lần PUT đầu cho 1 key chưa tồn tại sẽ **tạo** record.
- **Seeder**: 
  - `AcceptanceReportSettingSeeder` — group `acceptance_report` (template_html, template_title).
  - Các seeder khác theo group (OgTicket SLA, ...) xem thư mục `database/seeders/Tenant/Setting/` nếu có.

### Các group phổ biến

| Group | Key ví dụ | Seeder |
|-------|-----------|--------|
| `acceptance_report` | `template_html`, `template_title` | `AcceptanceReportSettingSeeder` |
| `og_ticket` | `sla_quote_minutes`, … | (theo OgTicket seeder) |
| `commission` | (nếu có) | — |

Group/key list cụ thể do enum hoặc const trong service định nghĩa — không tự phát sinh từ UI.

## `/pmc/commission` (config) — Cấu hình hoa hồng theo dự án

Entity: `CommissionConfig` (+ adjusters) — quan hệ 1-1 với `Project`.

### Entry points

| Route | Tác dụng | Sinh record? |
|-------|---------|-------------|
| `GET /commission/projects` | List projects có thể cấu hình | Read-only |
| `GET /commission/projects/{projectId}` | Load config hiện tại | Read-only; nếu chưa có → trả default |
| `PUT /commission/projects/{projectId}` | **Save config** (upsert) | ✅ Lần PUT đầu → tạo config record |
| `GET /commission/projects/{projectId}/adjusters` | List adjusters | Read-only |
| `PUT /commission/projects/{projectId}/adjusters` | **Save adjusters** (replace-all) | ✅ Lần PUT đầu → tạo adjuster records |
| `GET /commission/projects/{projectId}/available-departments` | List departments gán vào config | Read-only |

### Điều kiện

- `project_id` phải tồn tại.
- Không có route delete — chỉ update về default.
- Thay đổi config **không** tự recalc `OrderCommissionSnapshot` — phải reopen + close lại `ClosingPeriod` (xem [closing-periods.md](closing-periods.md)).

## Đặc điểm chung

- Không có route `POST` chuyên dụng để tạo record.
- Lần `PUT` đầu tiên sẽ **upsert** (tạo nếu chưa có).
- Bộ record cố định theo enum / config scope — không thể mở rộng runtime mà không code thêm.
- Nếu seeder đã chạy → màn luôn có data; nếu chưa → rỗng cho tới khi admin PUT.
