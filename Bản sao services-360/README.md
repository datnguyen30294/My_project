# Hệ Thống Quản Lý Khu Dân Cư

Một nền tảng quản lý khu dân cư hiện đại được xây dựng với Laravel 12, giúp tối ưu hóa các hoạt động hàng ngày cho cư dân, ban quản lý tòa nhà (BQL), và nhà cung cấp.

## 📋 Tổng Quan

Hệ thống Quản Lý Khu Dân Cư cung cấp nền tảng thương mại điện tử và dịch vụ toàn diện cho các khu dân cư, cho phép:

- **Cư dân** đặt hàng sản phẩm/dịch vụ, theo dõi giao hàng, và đánh giá chất lượng
- **Ban Quản Lý (BQL)** quản lý cư dân, giám sát hoạt động, và phân tích dữ liệu kinh doanh
- **Nhà cung cấp** nhận đơn hàng, quản lý giao hàng, và duy trì chất lượng dịch vụ

## ✨ Tính Năng Chính

### Cư Dân
- Đăng ký và xác thực tài khoản
- Duyệt sản phẩm và đặt hàng
- Theo dõi đơn hàng
- Đánh giá sản phẩm/dịch vụ
- Quản lý hồ sơ cá nhân

### Ban Quản Lý
- Quản lý danh sách cư dân
- Xem báo cáo doanh thu
- Quản lý sản phẩm/dịch vụ
- Xử lý khiếu nại

### Nhà Cung Cấp
- Nhận và xử lý đơn hàng
- Cập nhật trạng thái giao hàng
- Xem đánh giá từ cư dân

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Framework:** Laravel 12
- **PHP:** 8.2+
- **Database:** MySQL/PostgreSQL
- **Cache:** Redis
- **Queue:** Redis

### Frontend
- **Templates:** Blade
- **CSS Framework:** Tailwind CSS v4
- **JavaScript:** Alpine.js
- **Build Tool:** Vite

### Development Tools
- **Testing:** PHPUnit 11
- **Code Quality:** Laravel Pint
- **Development Server:** Laravel Sail (Docker)
- **Logging:** Laravel Pail

## 🚀 Cài Đặt

### Yêu Cầu
- PHP 8.2 trở lên
- Composer 2.x
- Node.js 18+ và NPM
- MySQL hoặc PostgreSQL

### Các Bước Cài Đặt

1. **Clone repository**

```bash
git clone https://github.com/0henri0/residential-management.git
cd residential-management
```

2. **Cài đặt dependencies**

```bash
composer install
npm install
```

3. **Thiết lập môi trường**

```bash
cp .env.example .env
php artisan key:generate
```

4. **Cấu hình database**

Chỉnh sửa file `.env` và thiết lập thông tin database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=residential_management
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. **Chạy migrations**

```bash
php artisan migrate --seed
```

6. **Build assets**

```bash
npm run build
```

7. **Khởi chạy development server**

```bash
composer run dev
```

Hoặc sử dụng Laravel Sail (Docker):

```bash
./vendor/bin/sail up
```

Ứng dụng sẽ chạy tại `http://localhost:8000`

### Cài Đặt Nhanh

Sử dụng lệnh setup tự động:

```bash
composer run setup
```

Lệnh này sẽ tự động cài đặt dependencies, copy file môi trường, generate app key, chạy migrations, cài đặt npm packages, và build assets.

## 📁 Cấu Trúc Dự Án

```
residential-management/
├── app/                   # Application code
├── bootstrap/             # Bootstrap files
├── config/                # Configuration files
├── database/              # Database migrations, seeders
├── docs/                  # Documentation
├── public/                # Public assets
├── resources/             # Views, CSS, JS
├── routes/                # Route definitions
├── storage/               # Application storage
└── tests/                 # Test files
```

## 🧪 Testing

Chạy tất cả tests:

```bash
php artisan test
```

## 🎯 Phát Triển

### Format Code

Sử dụng Laravel Pint để format code:

```bash
vendor/bin/pint
```

### Tạo Model T mới

```bash
php artisan make:model Product --factory --seeder
```

### Tạo Test

```bash
php artisan make:test OrderTest --phpunit
```

## 📚 Tài Liệu Tham Khảo

- [Laravel Documentation](https://laravel.com/docs/12.x)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Phân Tích Nghiệp Vụ](docs/BUSINESS_ANALYSIS.md)

---

**Built with ❤️ using Laravel 12**
