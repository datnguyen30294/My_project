# Màn `/pmc/quan-ly-cong-viec` — Lịch làm việc & năng lực nhân sự

3 sub-screen chính: **work-schedule**, **schedule-slots**, **workforce-capacity**. Dữ liệu đa số **derived** hoặc **seeder-driven**, không có tạo tay từ UI.

## WorkSchedule — Lịch làm việc

Entity: `App\Modules\PMC\WorkSchedule\Models\WorkSchedule`.

### Entry points

- **Read-only endpoint** ở tenant API:
  - `GET /work-schedules` — `app/Modules/PMC/routes/api.php:57-59` (`only(['index', 'show'])`).
- **Nguồn sinh**: `WorkScheduleSeeder` khi setup tenant (generate lịch mẫu dựa trên `Shift` + account active). Không có route `POST` ở tenant API.
- **Thay đổi lịch**: phải qua seeder / job backend, không phải UI CRUD.

## ScheduleSlot — Slot làm việc chi tiết

Entity: slot cụ thể (giờ/phút) của account trong 1 WorkSchedule.

### Entry points

- **Read-only endpoints**:
  - `GET /schedule-slots/personal` — lịch của chính user đang đăng nhập.
  - `GET /schedule-slots/team` — lịch cả team.
  - `GET /schedule-slots/detail` — detail 1 slot.
- **Không có route tạo**. Sinh tự động khi tạo `WorkSchedule` (qua seeder hoặc logic sinh schedule).

## WorkforceCapacity — Năng lực nhân sự

Entity: **metric computed**, không có bảng riêng trong code hiện tại (hoặc là view).

### Entry points

- **Chỉ** `GET /workforce/capacity` — `app/Modules/PMC/routes/api.php:64`.
- Không sinh record — tính ad-hoc từ `WorkSchedule` + `OgTicket` workload.

## Shift — Ca làm việc

Shift là master data riêng (có CRUD) — xem [master-data.md](master-data.md#tổng-hợp). WorkSchedule dùng Shift làm nguồn để generate slot.

## Tóm lại

Nếu màn work-schedule hiển thị rỗng → nguyên nhân thường là:

1. Seeder chưa chạy cho tenant.
2. Chưa có `Shift` master data → seeder không sinh được schedule.
3. Chưa có account active trong tenant.

Khi cần thay đổi lịch, hiện chỉ có đường:

- Chạy lại seeder (dev).
- Hoặc bổ sung API/UI riêng cho admin tạo/sửa WorkSchedule + ScheduleSlot (**chưa có**).
