# Thiết kế Zalo ZBS Template Message — Thông báo đơn hàng

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Hướng dẫn cài đặt template trên Zalo](#2-hướng-dẫn-cài-đặt-template-trên-zalo)
3. [Template 1: Đơn hàng đang xử lý](#3-template-1-đơn-hàng-đang-xử-lý)
4. [Template 2: Báo giá đã duyệt](#4-template-2-báo-giá-đã-duyệt)
5. [Template 3: Đơn hàng hoàn thành](#5-template-3-đơn-hàng-hoàn-thành)
6. [Tham khảo](#6-tham-khảo)

---

## 1. Tổng quan

### Mục đích

Gửi thông báo tự động đến khách hàng qua Zalo OA khi đơn hàng thay đổi trạng thái:

| # | Sự kiện | Trigger | Số lần gửi |
|---|---------|---------|------------|
| 1 | Đơn hàng đang xử lý | Order: `Confirmed → InProgress` | 1 lần/đơn |
| 2 | Báo giá đã duyệt | Quote: `Sent → ManagerApproved` | Nhiều lần (mỗi báo giá) |
| 3 | Đơn hàng hoàn thành | Order: `InProgress → Completed` | 1 lần/đơn |

### Cấu hình chung

| Field | Value | Lý do |
|-------|-------|-------|
| `template_type` | `1` (Template tùy chỉnh) | Linh hoạt, hỗ trợ tất cả components |
| `tag` | `2` (Customer care) | Chăm sóc khách hàng, cập nhật dịch vụ |

Template 3 dùng `template_type` = `5` (Đánh giá dịch vụ), `tag` = `2`.

### Dữ liệu từ hệ thống

```
Order → Quote → OgTicket
├── requester_name      → customer_name
├── requester_phone     → SĐT gửi Zalo
├── subject             → subject (mô tả yêu cầu)
├── order.code          → order_code
└── status enum label() → status
```

---

## 2. Hướng dẫn cài đặt template trên Zalo

### Cách 1: Qua giao diện ZBS Account (khuyến nghị)

1. Đăng nhập **ZBS Account** tại [https://account.zalo.cloud](https://account.zalo.cloud)
2. Liên kết **Zalo Official Account (OA)** với ZBS Account
3. Tạo **App** (ứng dụng đại diện cho OA)
4. Vào mục **Quản lý Template** → **Tạo mẫu tin mới**
5. Chọn loại + tag theo từng template (xem bên dưới)
6. Thiết kế nội dung: kéo thả components (Title, Paragraph, Table, Button, Rating)
7. Khai báo params (tên, loại, dữ liệu mẫu)
8. Gửi kiểm duyệt → Zalo duyệt trong **1-2 ngày làm việc**
9. Sau khi duyệt: trạng thái chuyển `PENDING_REVIEW` → `ENABLE`

> Tham khảo: https://zalo.solutions/blog/huong-dan-tao-mau-thong-bao-zns/

### Cách 2: Qua API

```
POST https://business.openapi.zalo.me/template/create
Content-Type: application/json
Header: access_token
```

Giới hạn: 100 requests/ngày. Quyền cần có: Quản lý tài sản.

### Prerequisite

1. Tạo tài khoản ZBS tại [account.zalo.cloud](https://account.zalo.cloud)
2. Liên kết Zalo OA với ZBS Account
3. Tạo App → cấp quyền "Quản lý tài sản"
4. Lấy Access Token (OAuth2) — [tài liệu xác thực](https://developers.zalo.me/docs/official-account/bat-dau/xac-thuc-va-uy-quyen-cho-ung-dung-new)

### Quy trình

```
Tạo template (API/UI) → PENDING_REVIEW → Zalo kiểm duyệt (1-2 ngày)
                                           ├── ENABLE  → Có thể gửi tin
                                           └── REJECT  → Sửa và gửi lại
```

---

## 3. Template 1: Đơn hàng đang xử lý

**Trigger:** Order `Confirmed → InProgress` (1 lần/đơn)
**Type:** `template_type: 1` (Tùy chỉnh), `tag: 2` (Customer care)

### Preview

```
[Logo công ty]

Xin chào {{customer_name}},
Yêu cầu của bạn đã được tiếp nhận và đang được xử lý.

 Mã Yêu cầu    {{order_code}}
 Nội dung       {{subject}}
 Trạng thái     {{status}}          ← row_type: 2 (Cập nhật)

[ Xem chi tiết yêu cầu ]
```

### API Request

```bash
curl -X POST 'https://business.openapi.zalo.me/template/create' \
-H 'Content-Type: application/json' \
-H 'access_token: your_access_token' \
-d '{
  "template_name": "Thông báo yêu cầu đang xử lý",
  "template_type": "1",
  "tag": "2",
  "layout": {
    "header": {
      "components": [
        {
          "LOGO": {
            "light": { "type": "IMAGE", "media_id": "<logo_light_media_id>" },
            "dark": { "type": "IMAGE", "media_id": "<logo_dark_media_id>" }
          }
        }
      ]
    },
    "body": {
      "components": [
        {
          "TITLE": { "value": "Thông báo cập nhật yêu cầu" }
        },
        {
          "PARAGRAPH": { "value": "Xin chào <customer_name>,\nYêu cầu của bạn đã được tiếp nhận và đang được xử lý." }
        },
        {
          "TABLE": {
            "rows": [
              { "title": "Mã Yêu cầu", "value": "<order_code>" },
              { "title": "Nội dung", "value": "<subject>" },
              { "title": "Trạng thái", "value": "<status>", "row_type": 2 }
            ]
          }
        }
      ]
    },
    "footer": {
      "components": [
        {
          "BUTTONS": {
            "items": [
              { "type": 1, "title": "Xem chi tiết yêu cầu", "content": "<order_url>" }
            ]
          }
        }
      ]
    }
  },
  "params": [
    { "name": "customer_name", "type": "1", "sample_value": "Nguyễn Văn A" },
    { "name": "order_code", "type": "4", "sample_value": "DH-2026-001" },
    { "name": "subject", "type": "5", "sample_value": "Sửa chữa điều hòa" },
    { "name": "status", "type": "6", "sample_value": "Đang thực hiện" },
    { "name": "order_url", "type": "13", "sample_value": "https://example.com/yeu-cau/123" }
  ],
  "note": "Thông báo yêu cầu đang được xử lý cho cư dân"
}'
```

### Mapping dữ liệu

| Param | Type | Source | Ví dụ |
|-------|------|--------|-------|
| `customer_name` | 1 - Tên KH (30) | `ogTicket.requester_name` | Nguyễn Văn A |
| `order_code` | 4 - Mã số (30) | `order.code` | DH-2026-001 |
| `subject` | 5 - Nhãn tùy chỉnh (30) | `ogTicket.subject` | Sửa chữa điều hòa |
| `status` | 6 - Trạng thái (30) | `order.status->label()` | Đang thực hiện |
| `order_url` | 13 - URL (200) | Generated | `https://domain/yeu-cau/123` |

---

## 4. Template 2: Báo giá đã duyệt

**Trigger:** Quote `Sent → ManagerApproved` (nhiều lần — mỗi báo giá 1 lần)
**Type:** `template_type: 1` (Tùy chỉnh), `tag: 2` (Customer care)

### Preview

```
[Logo công ty]

Xin chào {{customer_name}},
Yêu cầu của bạn đã có báo giá. Vui lòng kiểm tra và phê duyệt.

 Mã Yêu cầu    {{order_code}}
 Nội dung       {{subject}}
 Trạng thái     {{status}}          ← row_type: 1 (Thành công)

[ Xem chi tiết báo giá ]
```

### API Request

```bash
curl -X POST 'https://business.openapi.zalo.me/template/create' \
-H 'Content-Type: application/json' \
-H 'access_token: your_access_token' \
-d '{
  "template_name": "Thông báo báo giá đã được duyệt",
  "template_type": "1",
  "tag": "2",
  "layout": {
    "header": {
      "components": [
        {
          "LOGO": {
            "light": { "type": "IMAGE", "media_id": "<logo_light_media_id>" },
            "dark": { "type": "IMAGE", "media_id": "<logo_dark_media_id>" }
          }
        }
      ]
    },
    "body": {
      "components": [
        {
          "TITLE": { "value": "Thông báo báo giá đã được duyệt" }
        },
        {
          "PARAGRAPH": { "value": "Xin chào <customer_name>,\nYêu cầu của bạn đã có báo giá. Vui lòng kiểm tra và phê duyệt." }
        },
        {
          "TABLE": {
            "rows": [
              { "title": "Mã Yêu cầu", "value": "<order_code>" },
              { "title": "Nội dung", "value": "<subject>" },
              { "title": "Trạng thái", "value": "<status>", "row_type": 1 }
            ]
          }
        }
      ]
    },
    "footer": {
      "components": [
        {
          "BUTTONS": {
            "items": [
              { "type": 1, "title": "Xem chi tiết báo giá", "content": "<quote_url>" }
            ]
          }
        }
      ]
    }
  },
  "params": [
    { "name": "customer_name", "type": "1", "sample_value": "Nguyễn Văn A" },
    { "name": "order_code", "type": "4", "sample_value": "DH-2026-001" },
    { "name": "subject", "type": "5", "sample_value": "Sửa chữa điều hòa" },
    { "name": "status", "type": "6", "sample_value": "QL đã duyệt" },
    { "name": "quote_url", "type": "13", "sample_value": "https://example.com/bao-gia/456" }
  ],
  "note": "Thông báo báo giá đã duyệt, yêu cầu cư dân phê duyệt"
}'
```

### Mapping dữ liệu

| Param | Type | Source | Ví dụ |
|-------|------|--------|-------|
| `customer_name` | 1 - Tên KH (30) | `ogTicket.requester_name` | Nguyễn Văn A |
| `order_code` | 4 - Mã số (30) | `order.code` (qua quote→order) | DH-2026-001 |
| `subject` | 5 - Nhãn tùy chỉnh (30) | `ogTicket.subject` | Sửa chữa điều hòa |
| `status` | 6 - Trạng thái (30) | `quote.status->label()` | QL đã duyệt |
| `quote_url` | 13 - URL (200) | Generated | `https://domain/bao-gia/456` |

---

## 5. Template 3: Đơn hàng hoàn thành + Đánh giá dịch vụ

**Trigger:** Order `InProgress → Completed` (1 lần/đơn)
**Type:** `template_type: 5` (Đánh giá dịch vụ), `tag: 2` (Customer care)

> Template đánh giá dịch vụ có sẵn component Rating (1-5 sao) từ Zalo.
> Khi khách hàng chấm sao, Zalo gửi webhook về hệ thống.

### Preview

```
[Logo công ty]

Xin chào {{customer_name}},
Đơn hàng của bạn đã hoàn thành. Vui lòng đánh giá chất lượng dịch vụ!

 Mã Yêu cầu    {{order_code}}
 Nội dung       {{subject}}
 Trạng thái     {{status}}          ← row_type: 1 (Thành công)

⭐⭐⭐⭐⭐  (Rating 1-5 sao)

[ Xem chi tiết yêu cầu ]
```

### API Request

```bash
curl -X POST 'https://business.openapi.zalo.me/template/create' \
-H 'Content-Type: application/json' \
-H 'access_token: your_access_token' \
-d '{
  "template_name": "Thông báo hoàn thành và đánh giá dịch vụ",
  "template_type": "5",
  "tag": "2",
  "layout": {
    "header": {
      "components": [
        {
          "LOGO": {
            "light": { "type": "IMAGE", "media_id": "<logo_light_media_id>" },
            "dark": { "type": "IMAGE", "media_id": "<logo_dark_media_id>" }
          }
        }
      ]
    },
    "body": {
      "components": [
        {
          "TITLE": { "value": "Thông báo hoàn thành đơn hàng" }
        },
        {
          "PARAGRAPH": { "value": "Xin chào <customer_name>,\nĐơn hàng của bạn đã hoàn thành. Vui lòng đánh giá chất lượng dịch vụ!" }
        },
        {
          "TABLE": {
            "rows": [
              { "title": "Mã Yêu cầu", "value": "<order_code>" },
              { "title": "Nội dung", "value": "<subject>" },
              { "title": "Trạng thái", "value": "<status>", "row_type": 1 }
            ]
          }
        },
        {
          "RATING": {}
        }
      ]
    },
    "footer": {
      "components": [
        {
          "BUTTONS": {
            "items": [
              { "type": 1, "title": "Xem chi tiết yêu cầu", "content": "<order_url>" }
            ]
          }
        }
      ]
    }
  },
  "params": [
    { "name": "customer_name", "type": "1", "sample_value": "Nguyễn Văn A" },
    { "name": "order_code", "type": "4", "sample_value": "DH-2026-001" },
    { "name": "subject", "type": "5", "sample_value": "Sửa chữa điều hòa" },
    { "name": "status", "type": "6", "sample_value": "Hoàn thành" },
    { "name": "order_url", "type": "13", "sample_value": "https://example.com/yeu-cau/123" }
  ],
  "note": "Thông báo hoàn thành đơn hàng + yêu cầu đánh giá dịch vụ"
}'
```

### Mapping dữ liệu

| Param | Type | Source | Ví dụ |
|-------|------|--------|-------|
| `customer_name` | 1 - Tên KH (30) | `ogTicket.requester_name` | Nguyễn Văn A |
| `order_code` | 4 - Mã số (30) | `order.code` | DH-2026-001 |
| `subject` | 5 - Nhãn tùy chỉnh (30) | `ogTicket.subject` | Sửa chữa điều hòa |
| `status` | 6 - Trạng thái (30) | `order.status->label()` | Hoàn thành |
| `order_url` | 13 - URL (200) | Generated | `https://domain/yeu-cau/123` |

### Nhận kết quả đánh giá

Khi khách hàng chấm sao, Zalo gửi webhook event về URL đã cấu hình:

- Webhook: [Sự kiện người dùng phản hồi template đánh giá dịch vụ](https://developers.zalo.me/docs/zbs-template-message/quan-ly-template/template-webhook/su-kien-nguoi-dung-phan-hoi-template-danh-gia-dich-vu)
- Dữ liệu nhận: `rating` (1-5), `feedback` (text tùy chọn), `tracking_id`
- Mapping: Lưu vào `ogTicket.resident_rating` và `ogTicket.resident_rating_comment`

---

## 6. Tham khảo

### Param types

| Value | Param type | Max length |
|-------|-----------|------------|
| 1 | Tên khách hàng | 30 |
| 2 | Số điện thoại | 15 |
| 3 | Địa chỉ | 200 |
| 4 | Mã số | 30 |
| 5 | Nhãn tùy chỉnh | 30 |
| 6 | Trạng thái giao dịch | 30 |
| 7 | Thông tin liên hệ | 50 |
| 9 | Tên sản phẩm / Thương hiệu | 200 |
| 10 | Số lượng / Số tiền | 20 |
| 11 | Thời gian | 20 |
| 13 | URL | 200 |
| 14 | Tiền tệ (VNĐ) | 12 |

### Template types

| Value | Loại mẫu tin | Tag cho phép |
|-------|-------------|-------------|
| 1 | Template tùy chỉnh | 1, 2, 3 |
| 2 | Template xác thực | 1 |
| 3 | Template yêu cầu thanh toán | 1, 3 |
| 4 | Template voucher | 1, 2, 3 |
| 5 | Template đánh giá dịch vụ | 2 |

### Tags

| Value | Tag | Use case |
|-------|-----|----------|
| 1 | Transaction | OTP, xác nhận đơn hàng, trạng thái thanh toán |
| 2 | Customer care | Nhắc lịch, cập nhật dịch vụ, khảo sát |
| 3 | Promotion | Voucher, ưu đãi, upsell |

### Component specs

| Component | Constraints |
|-----------|-------------|
| TITLE | 9-65 ký tự, max 4 params |
| PARAGRAPH | 9-400 ký tự, max 10 params |
| TABLE | 2-8 rows; title: 3-36 chars (fixed), value: 3-90 chars |
| BUTTONS | 1-2 buttons; title: 5-30 chars (fixed), content: URL/phone |
| RATING | Thang 1-5 sao, kết quả qua webhook |

### Table row_type

| Value | Hiệu ứng |
|-------|----------|
| 0 | Không có hiệu ứng |
| 1 | Thành công (xanh) |
| 2 | Cập nhật (vàng) |
| 3 | Lưu ý |
| 4 | Báo lỗi (đỏ) |

### Button types phổ biến

| Value | Loại |
|-------|------|
| 1 | Đến trang của doanh nghiệp |
| 2 | Gọi điện |
| 7 | Đến trang web khác |
| 12 | Xem chi tiết |

---

## Tài liệu tham khảo

- [Giới thiệu chung về Template](https://developers.zalo.me/docs/zbs-template-message/quan-ly-template/bat-dau/gioi-thieu-chung-ve-template)
- [Danh sách Components](https://developers.zalo.me/docs/zbs-template-message/quan-ly-template/bat-dau/danh-sach-components)
- [API Tạo Template](https://developers.zalo.me/docs/zbs-template-message/quan-ly-template/template-api/api-tao-template)
- [API Gửi tin qua SĐT](https://developers.zalo.me/docs/zbs-template-message/gui-tin-template-qua-sdt/api-gui-tin-qua-sdt/api-gui-tin)
- [Webhook đánh giá dịch vụ](https://developers.zalo.me/docs/zbs-template-message/quan-ly-template/template-webhook/su-kien-nguoi-dung-phan-hoi-template-danh-gia-dich-vu)
- [Hướng dẫn tạo mẫu ZBS trên UI](https://zalo.solutions/business-message/guidelines/en/huong-dan-tao-zbs-template-message)
