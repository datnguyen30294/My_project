# 05 — Cài đặt hệ thống

> Mục tiêu: chỉnh các thiết lập điều khiển luồng đơn hàng — SLA, tài khoản nhận chuyển khoản, mẫu biên bản nghiệm thu, chính sách, và danh mục hạng mục.

## A. Cài đặt SLA (cam kết thời gian)

1. Menu trái → **Cài đặt hệ thống** → **"Cài đặt SLA"**.
2. Điền (đơn vị **phút**):
   - **"SLA Báo giá (phút)"** — tối đa từ khi *Tiếp nhận* → khi *có Báo giá*.
   - **"SLA Hoàn thành (phút)"** — tối đa từ khi *chấp thuận báo giá* → khi đơn *hoàn thành*.
3. Bấm **"Cập nhật"** (*"Cập nhật cài đặt SLA thành công."*). Muốn bỏ thay đổi → **"Đặt lại"**.

> Ví dụ 1.440 phút = 1 ngày. Trễ hạn sẽ được cảnh báo trong quá trình xử lý ticket.

## B. Tài khoản nhận chuyển khoản

1. Menu trái → **Cài đặt hệ thống** → **"Tài khoản nhận CK"** (trang *"Tài khoản nhận chuyển khoản"*).
2. Điền **"Ngân hàng"**, **"Số tài khoản"**, **"Tên chủ tài khoản"**.
3. Bấm **"Lưu"** (*"Đã lưu cài đặt tài khoản ngân hàng."*).

> Thông tin này dùng để **tạo mã QR chuyển khoản** ở trang công nợ (xem [bài 03](./03-cong-no-va-thu-tien.md)).

## C. Template biên bản nghiệm thu

1. Menu trái → **Cài đặt hệ thống** → **"Template biên bản nghiệm thu"**.
2. Nhập **"Tiêu đề biên bản"** và **"Nội dung template"**.
3. Bấm **"Chèn biến"** để chèn các ô tự điền (tên cư dân, mã đơn, hạng mục…).
4. Bấm **"Xem trước"** để kiểm tra → **"Lưu"** (*"Lưu template thành công."*).

> Mẫu này được dùng khi **lập biên bản nghiệm thu** cho đơn (xem [bài 01, mục F](./01-tiep-nhan-va-xu-ly-don.md#f-lập-biên-bản-nghiệm-thu)).

## D. Chính sách (hiển thị cho cư dân)

1. Menu trái → **Cài đặt hệ thống** → **"Chính sách"** (trang *"Quản lý chính sách"*).
2. Soạn 2 văn bản: **"Điều khoản sử dụng"** và **"Chính sách bảo mật"**.
3. Đặt trạng thái: **"Đã xuất bản"** thì cư dân mới thấy; **"Chưa xuất bản"** là nháp nội bộ.

## E. Danh mục hạng mục & giá (dùng khi báo giá)

Nằm ở nhóm menu **Danh mục** (không thuộc Cài đặt hệ thống):

| Mục | Dùng để |
|-----|---------|
| **"Loại dịch vụ"** | Nhóm dịch vụ |
| **"Danh mục hàng"** | Hạng mục vật tư / dịch vụ — đặt **"Giá bán"** (cho cư dân) và **"Giá mua"** (giá vốn nội bộ) |
| **"Nhà cung cấp"** | Nguồn cung vật tư |

Tại **"Danh mục hàng"** có các tab **"Vật tư"**, **"Dịch vụ"**, **"Dịch vụ tùy chọn"**; bấm **"Tạo mục danh mục"** để thêm. Đây là nguồn hạng mục khi lập báo giá ([bài 02](./02-bao-gia.md)).

## F. Bảng tra nhanh "muốn đổi cái này chỉnh ở đâu?"

| Muốn thay đổi | Vào |
|---------------|-----|
| Hạn báo giá / hoàn thành | Cài đặt hệ thống → **"Cài đặt SLA"** |
| Tài khoản nhận tiền CK | Cài đặt hệ thống → **"Tài khoản nhận CK"** |
| Mẫu biên bản nghiệm thu | Cài đặt hệ thống → **"Template biên bản nghiệm thu"** |
| Điều khoản / bảo mật | Cài đặt hệ thống → **"Chính sách"** |
| Tỷ lệ chia hoa hồng | Kế toán/Tài chính → **"Cấu hình hoa hồng"** ([bài 04](./04-hoa-hong-va-chot-ky.md)) |
| Giá bán / giá vốn, hạng mục | Menu **Danh mục** |
| Khoá số liệu một kỳ | Kế toán/Tài chính → **"Kỳ kế toán"** ([bài 04](./04-hoa-hong-va-chot-ky.md)) |

## Liên quan

- Trước đó: [04 — Hoa hồng & chốt kỳ](./04-hoa-hong-va-chot-ky.md)
- Quay lại: [README](./README.md)
- Nền tảng nghiệp vụ: [flows/platform/04 — Các thiết lập](../flows/platform/04-config.md)
