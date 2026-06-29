# Tong hop hoa hong - Dac ta nghiep vu Frontend

> Module: `PMC/ClosingPeriod` | Ngay tao: 2026-04-09 | Trang thai: Draft

## 1. Tong quan

Trang **Tong hop hoa hong** la bao cao tong hop giup ke toan xem toan bo ket qua chia hoa hong tu cac ky chot phi. Nguoi dung co the loc theo ky chot, du an, loai nguoi nhan — va xem KPI tong quan cung chi tiet tung dong snapshot.

Day la trang **read-only** — khong co thao tac tao/sua/xoa.

## 2. Danh sach trang

| Trang | Route | Mo ta |
|-------|-------|-------|
| Tong hop hoa hong | `/pmc/ke-toan-tai-chinh/tong-hop-hoa-hong` | Bao cao tong hop hoa hong |

> Chi co 1 trang duy nhat (khong co detail/create/edit).

## 3. Trang Tong hop hoa hong

### 3.1 Bo loc (Filter Bar)

| Bo loc | Loai | Gia tri | Mac dinh | Mo ta |
|--------|------|---------|----------|-------|
| Ky chot | Dropdown | Danh sach cac ky chot + "Tat ca ky" + "Chua chot (pending)" | Ky mo moi nhat (neu co), hoac "Chua chot" | Loc snapshot theo ky chot phi |
| Du an | Dropdown | Danh sach du an tu API | "Tat ca du an" | Loc theo du an cua don hang |
| Loai nguoi nhan | Dropdown | Platform, Cong ty VH, Ban QT, Ban QL, Phong ban, Nhan vien | "Tat ca" | Loc theo `recipient_type` |
| Nguon tinh | Dropdown | Override, Config | "Tat ca" | Loc theo `resolved_from` |

**Logic dropdown "Ky chot":**
- Hien thi ky mo moi nhat (theo `period_end`) lam mac dinh
- Option "Chua chot (pending)": chi hien snapshot thuoc cac ky dang mo (`status = open`)
- Option "Tat ca ky": hien tat ca snapshot khong loc ky
- Cac ky cu the: hien ten ky + trang thai (badge)

### 3.2 KPI Cards

Hien thi 4 the KPI ngang hang (responsive: 2 cot mobile, 4 cot desktop).

| KPI | Du lieu | Format |
|-----|---------|--------|
| Tong hoa hong | `stats.total_commission` | So tien VND (vd: 15,000,000 d) |
| So don co snapshot | `stats.order_count` | So nguyen |
| So dong snapshot | `stats.snapshot_count` | So nguyen |
| So nguoi nhan | `stats.recipient_count` | So nguyen |

### 3.3 Bang: Hoa hong theo nguoi / ben nhan

**Mo ta:** Bang tong hop nhom theo nguoi/ben nhan, sap xep theo tong hoa hong giam dan.

| Cot | Du lieu | Ghi chu |
|-----|---------|---------|
| Nguoi / Ben nhan | `recipient_name` | Ten nguoi nhan (vd: "Platform", "Nguyen Van A") |
| Loai | `recipient_type.label` | Badge (vd: "Nhan vien", "Platform") |
| Tong hoa hong | `total_amount` | Format tien VND |
| So don hang | `order_count` | So nguyen |

**Sap xep:** Theo `total_amount` giam dan (mac dinh, tu API).

### 3.4 Bang: Chi tiet theo don hang

**Mo ta:** Bang chi tiet tung dong snapshot voi thong tin don hang, nguoi nhan, so tien, nguon tinh.

| Cot | Du lieu | Ghi chu |
|-----|---------|---------|
| Don hang | `order_code` | Link den trang chi tiet don hang |
| Ky chot | `closing_period_name` | Ten ky chot |
| Nguoi nhan | `recipient_name` | Ten nguoi/ben nhan |
| Loai | `recipient_type.label` | Badge mau theo loai |
| So tien | `amount` | Format tien VND |
| Nguon | `resolved_from` | Badge: "Override" (warning) / "Config" (neutral) |
| Gia tri | `percent` / `value_fixed` | Hien formula: "5%" hoac "1,000,000 d" hoac "1,000 + 5%" |

### 3.5 Hanh dong

| Hanh dong | Vi tri | Dieu kien | Ket qua |
|-----------|--------|-----------|---------|
| Click don hang | Cot "Don hang" trong bang chi tiet | Luon hien thi | Chuyen den trang chi tiet don hang `/pmc/don-hang/[id]` |
| Thay doi bo loc | Filter bar | Luon hien thi | Reload du lieu tu API voi params moi |

## 4. Luong nguoi dung

### 4.1 Xem bao cao

```
Menu "Ke toan/Tai chinh" → "Tong hop hoa hong"
  → Trang hien thi voi ky chot mac dinh (ky mo moi nhat)
  → KPI cards hien thi tong quan
  → Bang nguoi nhan: xem ai nhan bao nhieu
  → Bang chi tiet: xem tung dong snapshot
```

### 4.2 Loc theo ky chot

```
Chon ky chot tu dropdown
  → API goi lai voi closing_period_id moi
  → KPI + 2 bang cap nhat
```

### 4.3 Loc theo du an

```
Chon du an tu dropdown
  → API goi lai voi project_id
  → Chi hien snapshot lien quan den du an do
```

### 4.4 Xem chi tiet don hang

```
Click vao ma don hang trong bang chi tiet
  → Chuyen huong den trang chi tiet don hang
```

## 5. Phan quyen

| Hanh dong | Quyen can co |
|-----------|-------------|
| Xem trang tong hop hoa hong | `closing-periods.view` |

> Dung chung quyen voi Ky chot phi vi du lieu doc tu cung bang.

## 6. Trang thai loading / error

| Trang thai | Hien thi |
|------------|---------|
| Dang tai | Skeleton loader cho KPI cards + bang |
| Loi | UAlert variant="destructive" voi nut "Thu lai" |
| Khong co du lieu | Message "Chua co du lieu hoa hong cho bo loc nay" |
| Dang tai lai (khi doi filter) | Overlay loading tren noi dung hien tai |

## 7. Responsive

| Breakpoint | Layout |
|-----------|--------|
| Mobile (< 640px) | KPI: 2 cot, Bang: scroll ngang |
| Tablet (640-1024px) | KPI: 4 cot, Bang: scroll ngang |
| Desktop (> 1024px) | KPI: 4 cot, Bang: full width |

## 8. Ghi chu nghiep vu

- **Khong co thanh toan hoa hong (payout):** Mockup BA co cot "Thanh toan HH" voi trang thai da/chua thanh toan. Tinh nang nay chua co trong backend — field `payout_status` khong ton tai tren `order_commission_snapshots`. Se bo sung trong phien ban tuong lai neu can.
- **Khong co nut "Tinh lai tat ca":** Mockup BA co nut recalculate. Trong thuc te, viec tinh lai snapshot chi xay ra khi reopen ky chot (da co trong module Ky chot phi). Khong can nut rieng tren trang bao cao nay.
- **total_commission trong KPI:** La tong TAT CA dong snapshot (bao gom internal distribution dept/staff). Day khac voi `frozen_commission_total` trong ky chot (chi tinh top-level). Muc dich la de ke toan thay toan bo phan phoi.
- **Formula display:** Cot "Gia tri" hien thi cong thuc da dung de tinh hoa hong:
  - Neu `value_type = percent`: hien "X%"
  - Neu `value_type = fixed`: hien "X d"
  - Neu `value_type = both`: hien "X d + Y%"
  - Neu `value_type = null` va `resolved_from = override`: hien "Cung" (fixed override, khong co formula)
- **Dropdown ky chot:** Cac ky chot load tu API `/api/v1/pmc/closing-periods` (endpoint da co). Mac dinh chon ky mo moi nhat. Them option "Tat ca ky" va "Chua chot (pending)".
- **Dropdown du an:** Load tu API projects list (endpoint da co).
