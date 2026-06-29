# Tổng quan luồng tài chính

## 1. Công nợ

Công nợ được sinh ra khi đơn hàng chuyển sang trạng thái **Đã xác nhận**.

- Mỗi đơn hàng đã xác nhận → sinh đúng 1 công nợ (trạng thái: Chưa thanh toán).

---

## 2. Dòng tiền trong công nợ

Khi ghi nhận thu tiền (hoặc hoàn tiền) trong công nợ → tự động sinh ra 1 bản ghi **đối soát tài chính** (trạng thái: Chờ duyệt).

- Thu nhiều đợt → mỗi đợt sinh 1 bản ghi đối soát riêng.
- Trạng thái công nợ tự cập nhật: Chưa thanh toán → Thanh toán một phần → Đã thanh toán.

---

## 3. Đối soát tài chính

Kế toán duyệt từng bản ghi đối soát. Khi duyệt xong → tiền mới thực sự vào quỹ (Treasury).

- Đối soát thu công nợ được duyệt → sinh giao dịch tiền vào (Inflow).
- Đối soát hoàn tiền được duyệt → sinh giao dịch tiền ra (Outflow).
- Khi tất cả dòng tiền trong công nợ đã được đối soát đủ → công nợ chuyển sang **Hoàn thành**.

Ngoài ra, nạp/rút tiền thủ công cũng sinh đối soát (chỉ là cờ xác nhận, không sinh thêm giao dịch).

---

## 4. Kỳ kế toán

Đơn hàng chỉ được đưa vào kỳ kế toán khi thoả **cả 2 điều kiện**:

- Đơn hàng đã **Hoàn thành**.
- Công nợ đã **Thu đủ** (Đã thanh toán hoặc Hoàn thành).

Luồng:

1. Tạo kỳ kế toán (trạng thái: Mở).
2. Chọn các đơn hàng đủ điều kiện đưa vào kỳ → **sinh hoa hồng ngay lúc thêm**.
3. Đóng kỳ → chỉ khoá lại, không tính toán thêm.
4. Mở lại kỳ → **tính lại** hoa hồng theo cấu hình mới nhất.

---

## 5. Hoa hồng

Hoa hồng được sinh ra khi **thêm đơn hàng vào kỳ kế toán**.

- Hệ thống tính toán dựa trên cấu hình chia hoa hồng của dự án (4 bên → phòng ban → nhân viên).
- Kết quả: mỗi người nhận → 1 bản ghi hoa hồng (trạng thái: Chưa chi).
- Kế toán đánh dấu **Đã chi** → sinh giao dịch tiền ra trong quỹ.
- Nếu chuyển lại Chưa chi → giao dịch tiền bị xoá mềm.

---

## 6. Tiền ứng vật tư

Khi cần ứng tiền mua vật tư cho dòng sản phẩm trong đơn hàng → ghi nhận thủ công.

- Sinh giao dịch tiền ra trực tiếp trong quỹ (không qua đối soát).
- Xoá bản ghi ứng → giao dịch tiền bị xoá mềm.

---

## Sơ đồ tổng quan

```
Đơn hàng (Đã xác nhận)
  │
  ├─→ Công nợ (Chưa thanh toán)
  │     │
  │     ├─→ Thu tiền → Đối soát (Chờ duyệt)
  │     │                │
  │     │                └─→ [Kế toán duyệt] → Giao dịch tiền vào ← QUỸ
  │     │
  │     └─→ Đối soát đủ → Công nợ (Hoàn thành)
  │
  ├─→ Dòng sản phẩm (vật tư)
  │     │
  │     └─→ [Ứng tiền] → Giao dịch tiền ra ← QUỸ
  │
  └─→ Đơn hàng (Hoàn thành) + Công nợ (Thu đủ)
        │
        └─→ Thêm vào Kỳ kế toán → Hoa hồng (Chưa chi)
              │
              └─→ [Kế toán đánh dấu Đã chi] → Giao dịch tiền ra ← QUỸ
```

---

## 6 loại giao dịch trong quỹ

| Loại                | Hướng     | Khi nào sinh                     |
| ------------------- | --------- | -------------------------------- |
| Thu công nợ         | Tiền vào  | Đối soát thu công nợ được duyệt  |
| Hoàn tiền khách     | Tiền ra   | Đối soát hoàn tiền được duyệt    |
| Chi hoa hồng        | Tiền ra   | Hoa hồng đánh dấu Đã chi        |
| Chi ứng vật tư      | Tiền ra   | Ghi nhận ứng vật tư              |
| Nạp tiền thủ công   | Tiền vào  | Nạp tiền thủ công vào quỹ       |
| Rút tiền thủ công   | Tiền ra   | Rút tiền thủ công từ quỹ        |
