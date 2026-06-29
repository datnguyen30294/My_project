# Laravel Modular Base Package - Composer Package Plan

## 1. Tổng quan

Trích xuất các thành phần dùng chung từ `app/Common/` + `app/Modules/Auth/` thành **một** Composer package độc lập, có thể tái sử dụng ở nhiều dự án Laravel khác.

**Tên package:** `thaibz/laravel-modular-base`

**Kiến trúc:** Core luôn active + Optional modules tự detect khi dependency có mặt.

```
thaibz/laravel-modular-base
│
├── Core (luôn active)
│   ├── Base classes (Model, Service, Repository, Controller, Request, Resource)
│   ├── Exception handling (BusinessException, JsonResponseHelper)
│   ├── Module auto-discovery
│   └── Traits (Auditable)
│
├── Auth Module (auto-active khi detect laravel/passport)
│   ├── AuthService — login, register, logout, refresh (OAuth2 password grant)
│   ├── AuthController, Requests, UserResource
│   └── Token management (lifetime, revoke, purge)
│
└── Permission Module (auto-active khi detect spatie/laravel-permission)
    └── Role/permission seeder helpers, middleware integration
```

---

## 2. Các thành phần cần đẩy lên package

### 2.1. Core — Base Classes (luôn có)

| File hiện tại | Mô tả |
|---|---|
| `app/Common/Controllers/BaseController.php` | Abstract controller, extension point cho tất cả controllers |
| `app/Common/Models/BaseModel.php` | Abstract model với `scopeActive()`, `scopeRecent()`, `scopeLatestFirst()`, bắt buộc implement `casts()` |
| `app/Common/Services/BaseService.php` | Abstract service với `executeInTransaction()` - tự động wrap DB transaction, catch/log exception |
| `app/Common/Repositories/BaseRepository.php` | Abstract repository với CRUD, pagination, `applySorting()`, `getPerPage()` |
| `app/Common/Requests/BaseFormRequest.php` | Abstract form request - override `failedValidation()` trả JSON chuẩn format |
| `app/Common/Resources/BaseResource.php` | Abstract API resource - tự động thêm `success: true` vào response |
| `app/Common/Presenters/BasePresenter.php` | Abstract presenter với `formatDate()`, `formatCurrency()` (legacy, giữ lại cho backward compat) |

### 2.2. Core — Contracts / Interfaces

| File hiện tại | Mô tả |
|---|---|
| `app/Common/Contracts/RepositoryInterface.php` | Interface cho repository: `findById`, `findAll`, `create`, `update`, `delete`, `paginate` |
| `app/Common/Contracts/PresenterInterface.php` | Interface cho presenter: `present`, `presentCollection` |

### 2.3. Core — Exception Handling

| File hiện tại | Mô tả |
|---|---|
| `app/Common/Exceptions/BusinessException.php` | Custom exception cho business logic - chứa `errorCode`, `httpStatusCode`, `context` |
| Exception config trong `bootstrap/app.php` | Handler cho `ModelNotFoundException`, `NotFoundHttpException`, `BusinessException` → trả JSON chuẩn |

### 2.4. Core — Response Helpers

| File hiện tại | Mô tả |
|---|---|
| `app/Common/Http/JsonResponseHelper.php` | Static helper trả error response chuẩn format: `success`, `message`, `error_code`, `errors` |
| `app/Common/OpenApi/JsonResponseHelperExtension.php` | Fix Scramble OpenAPI docs cho pagination response (meta, links) |

### 2.5. Core — Traits

| File hiện tại | Mô tả |
|---|---|
| `app/Common/Traits/Auditable.php` | Tự động set `created_by`/`updated_by` từ Auth user, kèm relationships `creator()`/`updater()` |

### 2.6. Core — Service Provider / Module Auto-Discovery

| File hiện tại | Mô tả |
|---|---|
| `app/Common/Providers/CommonServiceProvider.php` | Auto-scan `app/Modules/*/Providers/` và register tất cả ServiceProvider tự động |

### 2.7. Auth Module (optional — cần `laravel/passport`)

| File hiện tại | Mô tả |
|---|---|
| `app/Modules/Auth/Providers/AuthServiceProvider.php` | Enable password grant, config token lifetime, load routes |
| `app/Modules/Auth/src/Contracts/AuthServiceInterface.php` | Interface: login, register, logout, refresh |
| `app/Modules/Auth/src/Services/AuthService.php` | Proxy `/oauth/token`, revoke tokens, credentials từ config |
| `app/Modules/Auth/src/Controllers/AuthController.php` | REST endpoints: login, register, logout, refresh, me |
| `app/Modules/Auth/src/Requests/LoginRequest.php` | Validate email + password |
| `app/Modules/Auth/src/Requests/RegisterRequest.php` | Validate name + email + password + confirmation |
| `app/Modules/Auth/src/Requests/RefreshTokenRequest.php` | Validate refresh_token |
| `app/Modules/Auth/src/Resources/UserResource.php` | Trả id, name, email, roles, permissions |
| `app/Modules/Auth/routes/api.php` | Route definitions |

---

## 3. Cấu trúc package

```
laravel-modular-base/
├── composer.json
├── LICENSE
├── README.md
├── config/
│   └── modular-base.php
├── src/
│   ├── ModularBaseServiceProvider.php    # Main provider: core + auto-detect optional modules
│   │
│   ├── Contracts/                        # ── Core ──
│   │   ├── RepositoryInterface.php
│   │   └── PresenterInterface.php
│   ├── Controllers/
│   │   └── BaseController.php
│   ├── Models/
│   │   └── BaseModel.php
│   ├── Repositories/
│   │   └── BaseRepository.php
│   ├── Services/
│   │   └── BaseService.php
│   ├── Requests/
│   │   └── BaseFormRequest.php
│   ├── Resources/
│   │   └── BaseResource.php
│   ├── Presenters/
│   │   └── BasePresenter.php
│   ├── Exceptions/
│   │   ├── BusinessException.php
│   │   └── ExceptionHandler.php
│   ├── Http/
│   │   └── JsonResponseHelper.php
│   ├── OpenApi/
│   │   └── JsonResponseHelperExtension.php
│   ├── Traits/
│   │   └── Auditable.php
│   ├── Providers/
│   │   └── ModuleDiscoveryProvider.php
│   │
│   └── Auth/                             # ── Optional: Auth Module ──
│       ├── AuthServiceProvider.php       #   (chỉ load khi laravel/passport có mặt)
│       ├── Contracts/
│       │   └── AuthServiceInterface.php
│       ├── Controllers/
│       │   └── AuthController.php
│       ├── Requests/
│       │   ├── LoginRequest.php
│       │   ├── RegisterRequest.php
│       │   └── RefreshTokenRequest.php
│       ├── Resources/
│       │   └── UserResource.php
│       ├── Services/
│       │   └── AuthService.php
│       └── routes/
│           └── api.php
│
└── tests/
    ├── TestCase.php
    ├── Unit/
    │   ├── BaseModelTest.php
    │   ├── BaseServiceTest.php
    │   ├── BaseRepositoryTest.php
    │   ├── BaseFormRequestTest.php
    │   ├── BaseResourceTest.php
    │   ├── BusinessExceptionTest.php
    │   ├── JsonResponseHelperTest.php
    │   └── AuditableTest.php
    └── Feature/
        ├── ModuleDiscoveryTest.php
        └── Auth/
            └── AuthTest.php
```

---

## 4. Optional Dependency — Cơ chế hoạt động

### 4.1. composer.json

```json
{
    "name": "thaibz/laravel-modular-base",
    "description": "Laravel base package for modular monolith — base classes, module auto-discovery, optional OAuth2 auth & RBAC.",
    "keywords": ["laravel", "modular", "base", "repository", "api-resource", "auth", "passport"],
    "license": "MIT",
    "type": "library",
    "require": {
        "php": "^8.2",
        "illuminate/database": "^11.0|^12.0",
        "illuminate/http": "^11.0|^12.0",
        "illuminate/routing": "^11.0|^12.0",
        "illuminate/support": "^11.0|^12.0",
        "illuminate/validation": "^11.0|^12.0"
    },
    "suggest": {
        "laravel/passport": "Required for Auth module — OAuth2 password grant with refresh token (v13+)",
        "spatie/laravel-permission": "Required for role-based access control integration"
    },
    "require-dev": {
        "orchestra/testbench": "^9.0|^10.0",
        "phpunit/phpunit": "^11.0",
        "laravel/passport": "^13.0",
        "spatie/laravel-permission": "^6.0"
    },
    "autoload": {
        "psr-4": {
            "Thaibz\\ModularBase\\": "src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Thaibz\\ModularBase\\Tests\\": "tests/"
        }
    },
    "extra": {
        "laravel": {
            "providers": [
                "Thaibz\\ModularBase\\ModularBaseServiceProvider"
            ]
        }
    },
    "minimum-stability": "stable",
    "prefer-stable": true
}
```

**Điểm quan trọng:**
- `require` — chỉ Laravel core, **không** bắt buộc Passport/Spatie
- `suggest` — gợi ý cho user khi `composer install`
- `require-dev` — cài Passport + Spatie để **chạy test trong package**, không ảnh hưởng dự án dùng package

### 4.2. Service Provider — Auto-detect

```php
<?php

namespace Thaibz\ModularBase;

use Illuminate\Support\ServiceProvider;
use Thaibz\ModularBase\Providers\ModuleDiscoveryProvider;

class ModularBaseServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/modular-base.php', 'modular-base');

        // Core: module auto-discovery
        if (config('modular-base.auto_discovery.enabled', true)) {
            $this->app->register(ModuleDiscoveryProvider::class);
        }

        // Optional: Auth module (chỉ khi Passport đã cài)
        if (class_exists(\Laravel\Passport\Passport::class)
            && config('modular-base.auth.enabled', true)) {
            $this->app->register(\Thaibz\ModularBase\Auth\AuthServiceProvider::class);
        }
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../config/modular-base.php' => config_path('modular-base.php'),
        ], 'modular-base-config');
    }
}
```

**`class_exists()` là zero-cost khi class không tồn tại** — PHP chỉ check autoloader, không load file.

### 4.3. Auth Service Provider trong package

```php
<?php

namespace Thaibz\ModularBase\Auth;

use Carbon\CarbonInterval;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;
use Thaibz\ModularBase\Auth\Contracts\AuthServiceInterface;
use Thaibz\ModularBase\Auth\Services\AuthService;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AuthServiceInterface::class, AuthService::class);
    }

    public function boot(): void
    {
        Passport::enablePasswordGrant();

        Passport::tokensExpireIn(
            CarbonInterval::days(config('modular-base.auth.access_token_lifetime_days', 15))
        );

        Passport::refreshTokensExpireIn(
            CarbonInterval::days(config('modular-base.auth.refresh_token_lifetime_days', 30))
        );

        if (config('modular-base.auth.routes.enabled', true)) {
            $this->loadRoutes();
        }
    }

    protected function loadRoutes(): void
    {
        Route::prefix(config('modular-base.auth.routes.prefix', 'api/v1/auth'))
            ->middleware(config('modular-base.auth.routes.middleware', ['api']))
            ->group(__DIR__.'/routes/api.php');
    }
}
```

### 4.4. Auth routes — Configurable features

```php
<?php

use Illuminate\Support\Facades\Route;
use Thaibz\ModularBase\Auth\Controllers\AuthController;

Route::post('login', [AuthController::class, 'login']);
Route::post('refresh', [AuthController::class, 'refresh']);

if (config('modular-base.auth.features.registration', true)) {
    Route::post('register', [AuthController::class, 'register']);
}

Route::middleware(config('modular-base.auth.guard_middleware', 'auth:api'))->group(function (): void {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
});
```

### 4.5. AuthService — Không hardcode User model

```php
<?php

namespace Thaibz\ModularBase\Auth\Services;

use Thaibz\ModularBase\Auth\Contracts\AuthServiceInterface;
use Thaibz\ModularBase\Exceptions\BusinessException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthService implements AuthServiceInterface
{
    public function login(array $credentials): array
    {
        $userModel = config('modular-base.auth.user_model', 'App\\Models\\User');

        $user = $userModel::query()->where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw new BusinessException(
                message: 'The provided credentials are incorrect.',
                errorCode: 'INVALID_CREDENTIALS',
                httpStatusCode: Response::HTTP_UNAUTHORIZED,
            );
        }

        $tokenData = $this->issueToken($credentials['email'], $credentials['password']);

        return array_merge(['user' => $user], $tokenData);
    }

    public function register(array $data): array
    {
        $userModel = config('modular-base.auth.user_model', 'App\\Models\\User');

        $user = $userModel::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        // Gán role mặc định (chỉ khi Spatie đã cài)
        $defaultRole = config('modular-base.auth.default_role', 'user');
        if ($defaultRole && method_exists($user, 'assignRole')) {
            $user->assignRole($defaultRole);
        }

        $tokenData = $this->issueToken($data['email'], $data['password']);

        return array_merge(['user' => $user], $tokenData);
    }

    public function logout(): void
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $user */
        $user = Auth::guard(config('modular-base.auth.guard', 'api'))->user();
        $token = $user->token();
        $token->revoke();
        $token->refreshToken?->revoke();
    }

    // ... refresh(), issueToken(), requestToken(), parseTokenResponse()
    // Giống hiện tại, nhưng đọc client credentials từ:
    // config('modular-base.auth.password_client.id')
    // config('modular-base.auth.password_client.secret')
}
```

---

## 5. Config file hoàn chỉnh

**`config/modular-base.php`**

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Module Auto-Discovery
    |--------------------------------------------------------------------------
    */
    'auto_discovery' => [
        'enabled' => true,
        'paths' => [
            app_path('Modules/*/Providers'),
            app_path('Modules/*/*/Providers'),
        ],
        'pattern' => '*ServiceProvider.php',
    ],

    /*
    |--------------------------------------------------------------------------
    | Response Format
    |--------------------------------------------------------------------------
    */
    'response' => [
        'success_key' => 'success',
        'message_key' => 'message',
        'error_code_key' => 'error_code',
        'errors_key' => 'errors',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */
    'pagination' => [
        'default_per_page' => 15,
        'max_per_page' => 100,
    ],

    /*
    |--------------------------------------------------------------------------
    | Date & Currency Format
    |--------------------------------------------------------------------------
    */
    'format' => [
        'date' => 'd/m/Y',
        'datetime' => 'd/m/Y H:i',
        'currency_locale' => 'vi_VN',
        'currency_symbol' => 'đ',
    ],

    /*
    |--------------------------------------------------------------------------
    | Sorting Defaults
    |--------------------------------------------------------------------------
    */
    'sorting' => [
        'default_sort_by' => 'created_at',
        'default_sort_direction' => 'desc',
    ],

    /*
    |--------------------------------------------------------------------------
    | Auditable
    |--------------------------------------------------------------------------
    */
    'auditable' => [
        'created_by_column' => 'created_by',
        'updated_by_column' => 'updated_by',
        'user_model' => 'App\\Models\\User',
    ],

    /*
    |--------------------------------------------------------------------------
    | Auth Module (Optional — requires laravel/passport)
    |--------------------------------------------------------------------------
    | Tự động active khi phát hiện laravel/passport đã cài.
    | Set enabled = false để tắt hoàn toàn dù Passport có mặt.
    */
    'auth' => [
        'enabled' => true,
        'user_model' => 'App\\Models\\User',
        'guard' => 'api',
        'guard_middleware' => 'auth:api',
        'default_role' => 'user',               // Role gán khi register (null = không gán)

        'access_token_lifetime_days' => 15,
        'refresh_token_lifetime_days' => 30,

        'password_client' => [
            'id' => env('PASSPORT_PASSWORD_CLIENT_ID'),
            'secret' => env('PASSPORT_PASSWORD_CLIENT_SECRET'),
        ],

        'routes' => [
            'enabled' => true,
            'prefix' => 'api/v1/auth',
            'middleware' => ['api'],
        ],

        'features' => [
            'registration' => true,              // false = tắt POST /register
            'refresh' => true,                   // false = tắt POST /refresh
        ],
    ],
];
```

---

## 6. Sử dụng package ở dự án mới

### Trường hợp 1: Chỉ cần base (không auth)

```bash
composer require thaibz/laravel-modular-base
php artisan vendor:publish --tag=modular-base-config
```

Dùng được ngay: BaseModel, BaseService, BaseRepository, Exception handling, Module discovery.

### Trường hợp 2: Base + Auth (OAuth2)

```bash
composer require thaibz/laravel-modular-base laravel/passport
php artisan vendor:publish --tag=modular-base-config
php artisan passport:install
php artisan passport:client --password
# → Copy client_id + client_secret vào .env
```

Auth module tự active. Có sẵn: `/api/v1/auth/login`, `/register`, `/logout`, `/refresh`, `/me`.

### Trường hợp 3: Base + Auth + Permission (full stack)

```bash
composer require thaibz/laravel-modular-base laravel/passport spatie/laravel-permission
php artisan vendor:publish --tag=modular-base-config
php artisan passport:install
php artisan passport:client --password
```

Register tự gán role. UserResource tự trả roles + permissions.

### User model setup

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\Contracts\OAuthenticatable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;  // optional

class User extends Authenticatable implements OAuthenticatable
{
    use HasApiTokens, HasRoles, HasFactory, Notifiable;

    public function validateForPassportPasswordGrant(string $password): bool
    {
        return Hash::check($password, $this->password);
    }
}
```

---

## 7. Các bước thực hiện

### Bước 1-3: Giống plan cũ (tạo project, composer.json, base service provider)

### Bước 4: Chuyển Core source code

| Từ (project) | Thành (package) |
|---|---|
| `App\Common\Controllers\BaseController` | `Thaibz\ModularBase\Controllers\BaseController` |
| `App\Common\Models\BaseModel` | `Thaibz\ModularBase\Models\BaseModel` |
| `App\Common\Services\BaseService` | `Thaibz\ModularBase\Services\BaseService` |
| `App\Common\Repositories\BaseRepository` | `Thaibz\ModularBase\Repositories\BaseRepository` |
| `App\Common\Requests\BaseFormRequest` | `Thaibz\ModularBase\Requests\BaseFormRequest` |
| `App\Common\Resources\BaseResource` | `Thaibz\ModularBase\Resources\BaseResource` |
| `App\Common\Presenters\BasePresenter` | `Thaibz\ModularBase\Presenters\BasePresenter` |
| `App\Common\Contracts\RepositoryInterface` | `Thaibz\ModularBase\Contracts\RepositoryInterface` |
| `App\Common\Contracts\PresenterInterface` | `Thaibz\ModularBase\Contracts\PresenterInterface` |
| `App\Common\Exceptions\BusinessException` | `Thaibz\ModularBase\Exceptions\BusinessException` |
| `App\Common\Http\JsonResponseHelper` | `Thaibz\ModularBase\Http\JsonResponseHelper` |
| `App\Common\OpenApi\JsonResponseHelperExtension` | `Thaibz\ModularBase\OpenApi\JsonResponseHelperExtension` |
| `App\Common\Traits\Auditable` | `Thaibz\ModularBase\Traits\Auditable` |
| `App\Common\Providers\CommonServiceProvider` | `Thaibz\ModularBase\Providers\ModuleDiscoveryProvider` |

### Bước 5: Chuyển Auth module source code

| Từ (project) | Thành (package) |
|---|---|
| `App\Modules\Auth\Providers\AuthServiceProvider` | `Thaibz\ModularBase\Auth\AuthServiceProvider` |
| `App\Modules\Auth\Contracts\AuthServiceInterface` | `Thaibz\ModularBase\Auth\Contracts\AuthServiceInterface` |
| `App\Modules\Auth\Services\AuthService` | `Thaibz\ModularBase\Auth\Services\AuthService` |
| `App\Modules\Auth\Controllers\AuthController` | `Thaibz\ModularBase\Auth\Controllers\AuthController` |
| `App\Modules\Auth\Requests\LoginRequest` | `Thaibz\ModularBase\Auth\Requests\LoginRequest` |
| `App\Modules\Auth\Requests\RegisterRequest` | `Thaibz\ModularBase\Auth\Requests\RegisterRequest` |
| `App\Modules\Auth\Requests\RefreshTokenRequest` | `Thaibz\ModularBase\Auth\Requests\RefreshTokenRequest` |
| `App\Modules\Auth\Resources\UserResource` | `Thaibz\ModularBase\Auth\Resources\UserResource` |

### Bước 6: Refactor Auth — Thay hardcode bằng config

| Hardcode hiện tại | Config key |
|---|---|
| `User::query()` | `config('modular-base.auth.user_model')::query()` |
| `$user->assignRole('user')` | `config('modular-base.auth.default_role')` |
| `'api/v1/auth'` route prefix | `config('modular-base.auth.routes.prefix')` |
| `CarbonInterval::days(15)` | `config('modular-base.auth.access_token_lifetime_days')` |
| `Auth::guard('api')` | `Auth::guard(config('modular-base.auth.guard'))` |
| `config('passport.password_client.*')` | `config('modular-base.auth.password_client.*')` |
| `import BusinessException from App\Common` | `import from Thaibz\ModularBase\Exceptions` |

### Bước 7: Refactor Core — Giống plan cũ (config thay hardcode)

### Bước 8: Viết tests

### Bước 9: Đẩy lên Packagist

### Bước 10: Dự án hiện tại chuyển sang dùng package

```bash
composer require thaibz/laravel-modular-base laravel/passport spatie/laravel-permission
# Xóa app/Common/ (đã nằm trong package)
# Xóa app/Modules/Auth/ (đã nằm trong package)
# Đổi namespace imports trong các module còn lại (PMC, etc.)
```

---

## 8. Checklist trước khi publish

### Core
- [ ] Tất cả hardcode đã được thay bằng config
- [ ] Không còn reference tới `App\` namespace trong package
- [ ] User model configurable qua config (Auditable trait)
- [ ] Module discovery paths configurable
- [ ] Tất cả base class có PHPDoc đầy đủ

### Auth Module
- [ ] User model đọc từ config, không hardcode `App\Models\User`
- [ ] Default role đọc từ config, null = không gán
- [ ] Route prefix, middleware đọc từ config
- [ ] Token lifetime đọc từ config
- [ ] Password client credentials đọc từ config
- [ ] Registration endpoint có thể tắt qua config
- [ ] `class_exists` guard hoạt động — không crash khi Passport không cài
- [ ] Spatie integration graceful — `method_exists($user, 'assignRole')` check
- [ ] UserResource tự detect có Spatie hay không

### General
- [ ] Unit tests pass 100% (cả core + auth)
- [ ] Tests chạy được cả khi có và không có Passport/Spatie
- [ ] `composer validate` pass
- [ ] README.md có hướng dẫn cả 3 trường hợp sử dụng
- [ ] CHANGELOG.md cho version tracking
- [ ] LICENSE file (MIT)
- [ ] `.gitignore` (vendor/, .phpunit.cache/, etc.)
- [ ] Chạy `pint` format code

---

## 9. Lợi ích

| Lợi ích | Mô tả |
|---|---|
| **Một package, nhiều cấp độ** | Dự án đơn giản chỉ cần core, dự án phức tạp thêm auth + permission — cùng 1 package |
| **Zero overhead** | Module không cài dependency = không load, không ảnh hưởng performance |
| **Tái sử dụng** | Mọi dự án Laravel mới chỉ cần `composer require` là có đầy đủ architecture |
| **Chuẩn hóa** | Response format, exception, auth flow đồng nhất across projects |
| **Tốc độ** | Dự án mới có auth + permission chạy ngay, không cần viết lại |
| **Bảo trì** | Fix bug/cải tiến 1 lần, update tất cả dự án qua `composer update` |
| **Onboarding** | Dev mới vào dự án hiểu ngay architecture pattern |

---

## 10. Roadmap mở rộng (tương lai)

| Version | Tính năng |
|---|---|
| v1.0 | Core + Auth (optional) + Permission (optional) |
| v1.1 | Thêm `make:module` artisan command - scaffold module structure tự động |
| v1.2 | Thêm base Enum trait với `label()`, `values()`, `toSelectOptions()` |
| v1.3 | Thêm `HasSearch` trait cho Model - chuẩn hóa search scope pattern |
| v1.4 | Thêm `HasFilters` trait cho Repository - chuẩn hóa filter pattern |
| v1.5 | Thêm request/response logging middleware (tracing) |
| v1.6 | Auth: thêm social login (Google, GitHub) — optional khi có `socialite` |
| v1.7 | Auth: thêm 2FA support — optional khi có `pragmarx/google2fa` |
| v2.0 | Thêm CQRS support (tách Command/Query) |
