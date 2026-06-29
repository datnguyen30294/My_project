# Hệ thống TNP Services — Hướng dẫn sử dụng

Tài liệu **cầm tay chỉ việc** cho nghiệp vụ **đơn hàng dịch vụ** của đơn vị vận hành (PMC): từ tiếp nhận yêu cầu cư dân → báo giá → tạo đơn → nghiệm thu → thu tiền → chia hoa hồng.

Khác với bộ [tài liệu flow nghiệp vụ](../flows/platform/README.md) (mô tả *quy trình chạy thế nào*), tài liệu này chỉ rõ *thao tác trên màn hình ra sao*.

> Quy ước: tên **menu**, **nút bấm**, **ô nhập** ghi đúng như hiển thị, đặt trong **"ngoặc kép đậm"**. Mỗi bài liên kết tới flow nghiệp vụ tương ứng để hiểu sâu hơn.

## Mục lục

| # | Bài | Nội dung |
|---|-----|----------|
| 00 | [Đăng nhập & bản đồ menu](./00-dang-nhap-va-menu.md) | Đăng nhập, các vai trò, menu nằm ở đâu |
| 01 | [Tiếp nhận & xử lý đơn](./01-tiep-nhan-va-xu-ly-don.md) | Ticket Pool → nhận → phân công → khảo sát → tạo đơn → thi công → nghiệm thu |
| 02 | [Báo giá](./02-bao-gia.md) | Lập báo giá, thêm hạng mục, gửi cư dân, duyệt 2 cấp |
| 03 | [Công nợ & thu tiền](./03-cong-no-va-thu-tien.md) | Ghi nhận thu tiền (nhiều đợt), hoàn tiền, tuổi nợ, xoá nợ |
| 04 | [Hoa hồng & chốt kỳ](./04-hoa-hong-va-chot-ky.md) | Cấu hình hoa hồng, kỳ kế toán, chi hoa hồng |
| 05 | [Cài đặt hệ thống](./05-cai-dat-he-thong.md) | SLA, tài khoản nhận CK, template biên bản, chính sách, danh mục |

## Các vai trò

| Vai trò | Làm gì trong hệ thống |
|---------|----------------------|
| **CSKH / Điều phối** | Nhận ticket từ pool, phân công kỹ thuật viên |
| **Kỹ thuật viên (KTV)** | Khảo sát, lập báo giá, thi công, lập biên bản nghiệm thu |
| **Quản lý** | Duyệt báo giá, duyệt xoá nợ, chốt kỳ kế toán |
| **Kế toán** | Thu tiền, hoàn tiền, đối soát, chi hoa hồng |

## Lưu ý chung

- Bạn chỉ thấy các mục menu mà tài khoản mình được cấp quyền (theo **Vai trò** trong HRM).
- Tên trạng thái in **đậm** là trạng thái thực hiển thị trên màn hình.
- Muốn hiểu *vì sao* mỗi bước tồn tại → đọc [flows/platform](../flows/platform/README.md).
