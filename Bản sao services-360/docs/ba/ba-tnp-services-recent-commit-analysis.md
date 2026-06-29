# Phân tích commit gần đây của `BA-TNP-SERVICES`

> Nguồn phân tích: repo lồng `BA-TNP-SERVICES/.git`  
> Thời gian commit đã rà: `2026-02-26` đến `2026-03-05`  
> Ngày tổng hợp: `2026-03-07`

## 1. Mục tiêu

Tài liệu này dùng để trả lời 3 câu hỏi:

1. Trong các commit gần đây của `BA-TNP-SERVICES`, ngoài `Phòng ban` thì còn sửa thêm ở đâu.
2. Các thay đổi đó là thay đổi giao diện/mock data hay đã là thay đổi nghiệp vụ đáng lưu ý.
3. Những thay đổi nào đang đi trước `backend/` và `frontend/` của repo chính.

## 2. Kết luận nhanh

`BA-TNP-SERVICES` không còn là repo chỉ chứa mock HRM cơ bản. Qua các commit gần đây, repo này đã mở rộng theo 3 lớp:

- **Lớp 1: HRM cơ bản**  
  Thêm các màn `Tài khoản`, `Phòng ban`, `Chức danh`, seed mock và entity Pinia ORM.
- **Lớp 2: HRM mở rộng**  
  Thêm `Quản lý dự án`, quan hệ nhiều-nhiều `Account <-> Project`, `Phân quyền`, role mặc định, xem chi tiết tài khoản, lịch làm việc.
- **Lớp 3: Module mới ngoài HRM**  
  Thêm cả cụm `Quản lý ticket`, `Quản lý công việc`, `Quản lý đơn hàng`, `Kho & Dịch vụ`, cùng hệ docs, roadmap, UAT checklist và mock data tương ứng.

Điểm quan trọng nhất:

- Từ commit `819eeb7`, `Phòng ban` và `Chức danh` bắt đầu có **scope theo dự án** (`Trụ sở chính` hoặc `theo dự án`).
- Thay đổi này kéo theo tác động sang `Tài khoản`, `Role mặc định`, `Quản lý dự án`, và logic dữ liệu liên module.
- Repo chính `backend/` và `frontend/` hiện chưa theo kịp đầy đủ thay đổi này, đặc biệt ở phần `department/job title theo dự án`.

## 3. Lưu ý khi đọc lịch sử commit

Tên commit trong repo con hiện không phản ánh đúng nội dung nghiệp vụ. Nhiều commit khác nhau cùng dùng message như:

- `feature: sort option by displayOrder`
- `feature: keep filter when back from detail page`
- `feature: ignore default filter for cross db`

Vì vậy phải dựa vào **diff file** thay vì tin vào message commit.

## 4. Timeline thay đổi chính

| Mốc | Commit | Ý nghĩa thực tế |
|-----|--------|-----------------|
| Khởi tạo repo mockup | `802e5b2` | Khởi tạo skeleton Nuxt mockup, layout, config, store mockup, chưa có nghiệp vụ HRM sâu |
| Bổ sung docs shell | `d41439a` | Dựng docs page, navigation, module docs khung, `ContentMermaid`, `DocLink` |
| HRM base | `06a1863` | Thêm mock/seed và 3 module HRM cơ bản: `Tài khoản`, `Phòng ban`, `Chức danh` |
| Quan hệ dự án | `b138bb8` | Thêm `Project`, pivot `AccountProject`, quan hệ nhân sự theo dự án |
| Module dự án | `992de29` | Thêm màn `Quản lý dự án`, màn chi tiết dự án, cập nhật `Tài khoản` để gán nhiều dự án |
| Refine dự án | `a66ca13`, `5ca1e5c`, `7542c77`, `65fb7f4` | Chỉnh route/index/detail, breadcrumb, sort hiển thị |
| Phân quyền HRM | `914c0c0` | Thêm `Phân quyền`, role mặc định, permission matrix, gắn role vào account |
| Mở rộng mạnh theo roadmap | `819eeb7` | Mở rộng HRM theo dự án, thêm lịch làm việc, chi tiết tài khoản, và mở luôn ticket/order/work/inventory |
| Hoàn thiện ticket detail | `ebb4b27` | Thêm danh sách ticket dạng index + màn chi tiết ticket + cập nhật tài liệu ticket |

## 5. Ngoài `Phòng ban`, commit gần đây đã sửa thêm ở đâu

### 5.1 HRM > Chức danh

Từ trạng thái ban đầu chỉ là danh mục đơn giản, `Chức danh` đã được nâng cấp thành danh mục có thể thuộc:

- `Trụ sở chính`
- hoặc `một dự án cụ thể`

Thay đổi thể hiện ở:

- docs `content/docs/hrm/chuc-danh.md`
- entity `app/stores/entities/HrmJobTitle.ts`
- page `app/pages/modules/hrm/chuc-danh.vue`
- mock `app/mock/hrm/chuc-danh.ts`

Ý nghĩa nghiệp vụ:

- Chức danh không còn là danh mục dùng chung tuyệt đối.
- Nếu `Phòng ban` theo dự án và `Chức danh` cũng theo dự án thì logic role mặc định phải chuyển từ kiểu global sang kiểu cùng scope.

### 5.2 HRM > Tài khoản

`Tài khoản` là module bị ảnh hưởng nhiều nhất qua chuỗi commit:

- Ban đầu: account thuộc 1 phòng ban, 1 chức danh.
- Sau `b138bb8` và `992de29`: account có thể thuộc **nhiều dự án** qua pivot.
- Sau `914c0c0`: account có thêm **role**, tự gán role mặc định theo cặp `phòng ban + chức danh`.
- Sau `819eeb7`: thêm **màn chi tiết tài khoản** và phần hiển thị **lịch làm việc tháng này**.

Các file chính:

- `content/docs/hrm/tai-khoan.md`
- `app/pages/modules/hrm/tai-khoan.vue`
- `app/pages/modules/hrm/tai-khoan/index.vue`
- `app/pages/modules/hrm/tai-khoan/[id].vue`
- `app/stores/entities/HrmAccount.ts`
- `app/mock/hrm/tai-khoan.ts`
- `app/mock/hrm/account-project.ts`

Ý nghĩa nghiệp vụ:

- Account trở thành điểm giao giữa `Department`, `JobTitle`, `Role`, `Project`.
- Khi BA thêm `department/job title theo dự án`, account sẽ là chỗ dễ phát sinh rule xung đột nhất nếu BE/FE không validate scope.

### 5.3 HRM > Quản lý dự án

`Quản lý dự án` không phải thay đổi nhỏ, mà là module mới được đưa vào giữa dòng phát triển HRM:

- CRUD dự án
- trạng thái dự án
- gán nhân sự theo dự án
- màn chi tiết dự án hiển thị danh sách nhân viên đang thuộc dự án

Các file chính:

- `content/docs/hrm/quan-ly-du-an.md`
- `app/pages/modules/hrm/quan-ly-du-an.vue`
- `app/pages/modules/hrm/quan-ly-du-an/index.vue`
- `app/pages/modules/hrm/quan-ly-du-an/[id].vue`
- `app/stores/entities/HrmProject.ts`
- `app/stores/entities/HrmAccountProject.ts`
- `app/mock/hrm/du-an.ts`

Ý nghĩa nghiệp vụ:

- `Project` ban đầu chỉ là quan hệ gán nhân sự.
- Từ `819eeb7`, `Project` còn trở thành scope dữ liệu của `Phòng ban` và `Chức danh`.

### 5.4 HRM > Phân quyền

`914c0c0` là mốc mở rộng lớn cho HRM vì đã thêm hẳn module `Phân quyền`:

- role `mặc định` và `tùy chỉnh`
- permission matrix theo module con
- tự sinh role mặc định khi thêm phòng ban hoặc chức danh
- tự gán role mặc định khi đổi `phòng ban + chức danh` trên account

Các file chính:

- `content/docs/hrm/phan-quyen.md`
- `app/pages/modules/hrm/phan-quyen.vue`
- `app/composables/useHrmRoleDefault.ts`
- `app/stores/entities/HrmRole.ts`
- `app/stores/entities/HrmRolePermission.ts`

Ý nghĩa nghiệp vụ:

- Đây là thay đổi kiến trúc dữ liệu, không chỉ là thêm màn hình.
- Khi `Phòng ban` và `Chức danh` được gắn theo dự án ở `819eeb7`, logic role mặc định phải xem lại toàn bộ.

### 5.5 HRM > Lịch làm việc

`819eeb7` thêm:

- `app/pages/modules/hrm/lich-lam-viec-ca-nhan.vue`
- `app/pages/modules/hrm/lich-lam-viec-chung.vue`
- `app/composables/useHrmSchedule.ts`
- `app/mock/hrm/work-schedule.ts`
- `app/stores/entities/HrmShift.ts`
- `app/stores/entities/HrmWorkSchedule.ts`

Ý nghĩa nghiệp vụ:

- HRM trong repo con không còn dừng ở CRUD danh mục, mà đã bắt đầu đi vào vận hành ca làm việc.
- Tài liệu account đã tham chiếu màn lịch làm việc cá nhân, nhưng docs riêng cho 2 màn lịch làm việc hiện chưa thấy được bổ sung tương xứng.

### 5.6 HRM > Phòng ban

Đây là thay đổi đã phân tích trước, nhưng đặt trong toàn cảnh commit gần đây thì có 2 ý cần nhấn mạnh:

- `Phòng ban` ban đầu chỉ có cấu trúc cha-con.
- Từ `819eeb7`, `Phòng ban` có thêm `projectId`, lọc theo dự án, chọn parent cùng scope, và cột `Thuộc dự án`.

Điểm này không đứng riêng lẻ mà là một phần của đợt mở rộng HRM theo dự án.

## 6. Các module mới ngoài HRM

### 6.1 Quản lý ticket

Đây là cụm thay đổi lớn nhất ngoài HRM, chủ yếu nằm ở `819eeb7` và `ebb4b27`.

Phạm vi mới được thêm:

- module `Quản lý ticket`
- màn `Danh sách ticket`
- màn `Chi tiết ticket`
- state machine ticket
- SLA, ưu tiên, kênh tiếp nhận
- gắn `resident`, `project`, `apartment`, `receivedBy`, `assignedTo`

Các file chính:

- `content/docs/quan-ly-ticket.md`
- `content/docs/quan-ly-ticket/danh-sach-ticket.md`
- `app/pages/modules/quan-ly-ticket/danh-sach-ticket.vue`
- `app/pages/modules/quan-ly-ticket/danh-sach-ticket/index.vue`
- `app/pages/modules/quan-ly-ticket/danh-sach-ticket/[id].vue`
- `app/mock/order/tickets.ts`
- `app/stores/entities/OrderTicket.ts`

Ý nghĩa nghiệp vụ:

- Đây không còn là mock placeholder.
- Repo con đã bắt đầu mô tả một workflow đầy đủ từ ticket sang khảo sát, báo giá, đơn hàng.

### 6.2 Quản lý công việc

`819eeb7` thêm docs khung cho:

- lịch việc cá nhân
- lịch việc đội
- năng lực nhân sự
- phiếu khảo sát

File docs chính:

- `content/docs/quan-ly-cong-viec.md`
- `content/docs/quan-ly-cong-viec/*.md`

Ý nghĩa nghiệp vụ:

- Module này là cầu nối giữa `Ticket` và `Đơn hàng`.
- Dù page mockup chưa phủ hết các submodule, tài liệu đã xác lập luồng nghiệp vụ rồi.

### 6.3 Quản lý đơn hàng

`819eeb7` thêm:

- docs module `Quản lý đơn hàng`
- màn `Báo giá`
- màn `Danh sách đơn`
- data dictionary cho giá và khuyến mãi

Các file chính:

- `content/docs/quan-ly-don-hang.md`
- `content/docs/data-dictionary-gia.md`
- `app/pages/modules/quan-ly-don-hang/bao-gia.vue`
- `app/pages/modules/quan-ly-don-hang/danh-sach-don.vue`
- `app/stores/entities/Quote.ts`
- `app/stores/entities/SalesOrder.ts`

Ý nghĩa nghiệp vụ:

- Repo con bắt đầu mô tả rõ mô hình giá gốc, giá sau khuyến mãi, override thủ công, traceability từ ticket sang quote và order.

### 6.4 Kho & Dịch vụ

`819eeb7` bổ sung:

- docs module `Kho & Dịch vụ`
- danh mục vật tư
- danh mục dịch vụ
- tồn kho
- nhà cung cấp
- entity và mock data liên quan

Ý nghĩa nghiệp vụ:

- Đây là lớp dữ liệu đầu vào cho báo giá và đơn hàng.
- Cấu trúc dữ liệu đã được đặt trước dù page CRUD chưa phủ đầy đủ.

## 7. Hạ tầng docs và mockup cũng thay đổi đáng kể

Ngoài nghiệp vụ, repo con còn thay đổi mạnh ở lớp hiển thị tài liệu và shell mockup:

- thêm `DocsSidebar`
- thêm `LayoutAppHeader`, `LayoutAppSidebar`
- thêm `docs` layout riêng
- cập nhật `useHeaderNavItems`, `useBreadcrumb`
- cập nhật `stores/mockup.ts` để khai báo nhiều module/submodule hơn
- thêm `implementation-roadmap`, `backlog-mockup-waves`, `uat-checklist`

Ý nghĩa:

- `BA-TNP-SERVICES` đang được dùng không chỉ để mock giao diện, mà còn như một kho BRD mini + navigation living documentation.

## 8. Mối liên hệ giữa các thay đổi

Chuỗi thay đổi gần đây không rời rạc. Nó đi theo logic sau:

1. Dựng `HRM base`: account, department, job title.
2. Thêm `Project` và gán account theo dự án.
3. Thêm `Role/Permission` để chuẩn hóa phân quyền theo HRM.
4. Nâng `Department` và `JobTitle` thành danh mục có scope theo dự án.
5. Từ dữ liệu HRM đó mở rộng sang `Ticket -> Survey -> Quote -> Order`.

Nói cách khác, repo con đang dịch chuyển từ mock CRUD danh mục sang mô hình vận hành nghiệp vụ liên thông.

## 9. Khoảng cách với `backend/` và `frontend/` hiện tại của repo chính

Tại thời điểm tổng hợp:

- `backend/` và `frontend/` của repo chính vẫn đang theo mô hình cũ đối với `Department` và `JobTitle`.
- `Department` trong code chính chưa có `project_id`.
- request/resource/list UI hiện tại của `Department` chưa có filter hoặc field `Thuộc dự án`.
- `JobTitle` trong code chính cũng chưa có `project_id`.
- Vì vậy, thay đổi từ `819eeb7` của repo con đang đi trước code chính ít nhất ở phần:
  - scope dự án cho `Phòng ban`
  - scope dự án cho `Chức danh`
  - rule đồng bộ giữa `Account`, `Role`, `Department`, `JobTitle`, `Project`

Riêng phần `Role/Permission`, repo chính đã có nền tảng backend/frontend thật, nhưng logic scope theo dự án vẫn chưa được phản ánh đầy đủ.

## 10. Những điểm cần coi là change request thực sự

Từ các commit gần đây, có thể tách ra các change request thực chất như sau:

### CR-01: Department theo dự án

- `department.project_id`
- parent cùng scope
- filter/list/detail theo dự án
- tác động role mặc định và account

### CR-02: Job title theo dự án

- `job_title.project_id`
- filter/list/detail theo dự án
- tác động role mặc định và account

### CR-03: Account đa dự án + role mặc định

- pivot account-project
- tự gán role mặc định theo cặp danh mục
- xem chi tiết tài khoản

### CR-04: Dự án là scope nghiệp vụ trung tâm của HRM

- project không còn chỉ là danh mục độc lập
- project bắt đầu chi phối department/job title/account/work schedule

### CR-05: Mở rộng sang ticket/order/workflow

- workflow mới từ ticket tới đơn hàng
- dữ liệu cư dân, căn hộ, khảo sát, vật tư, dịch vụ
- roadmap và UAT cho các module ngoài HRM

## 11. Kiến nghị sử dụng tài liệu này

Tài liệu này nên được dùng theo 2 mục đích:

### 11.1 Cho BA / PM

- Xác định các yêu cầu nào đã xuất hiện ở repo con nhưng chưa được chốt thành CR chính thức.
- Tách riêng change của `HRM` với change của `Ticket/Order`.
- Chốt lại rule dữ liệu trước khi giao cho BE/FE.

### 11.2 Cho BE / FE

- Dùng timeline commit để hiểu thay đổi đến từ đâu.
- Không nên chỉ bám `phòng ban.md`; phải đọc cả `chuc-danh`, `tai-khoan`, `phan-quyen`, `quan-ly-du-an`.
- Nếu triển khai theo repo con hiện tại, cần coi `819eeb7` là mốc change business lớn, không phải commit UI thuần.

## 12. Tóm tắt ngắn nhất

Ngoài `Phòng ban`, các commit gần đây của `BA-TNP-SERVICES` đã sửa và mở rộng thêm:

- `Chức danh` theo dự án
- `Tài khoản` đa dự án, có role, có chi tiết tài khoản
- `Quản lý dự án`
- `Phân quyền / role mặc định`
- `Lịch làm việc`
- `Quản lý ticket`
- `Quản lý công việc`
- `Quản lý đơn hàng`
- `Kho & Dịch vụ`
- toàn bộ shell docs/navigation/roadmap/UAT của mockup repo

Mốc thay đổi quan trọng nhất vẫn là `819eeb7`, vì đây là commit làm repo con chuyển từ HRM mockup cục bộ sang một mô hình nghiệp vụ liên thông theo dự án.
