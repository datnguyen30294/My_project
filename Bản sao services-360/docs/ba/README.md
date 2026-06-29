# Business Analysis & Technical Documentation - Residential Management System

## Tổng quan

Repository này chứa tài liệu phân tích nghiệp vụ và thiết kế kỹ thuật cho **Hệ Thống Quản Lý Khu Dân Cư** (Residential Management System). Hệ thống được thiết kế như một nền tảng thương mại điện tử và quản lý dịch vụ tích hợp cho khu dân cư, bao gồm:

### Mục tiêu chính
1. **Làm rõ tổng quan phân tích nghiệp vụ** - Hiểu rõ từng module là gì và cách hoạt động
2. **Cung cấp flow để hỏi khách hàng** - Câu hỏi và kịch bản phỏng vấn cho từng module
3. **Xác định yêu cầu nghiệp vụ** - Functional và non-functional requirements chi tiết
4. **Thiết kế kiến trúc hệ thống** - Backend (Laravel Modular Monolith) và Frontend (Nuxt.js 3)
5. **Định hình luồng nghiệp vụ** - Workflow và use cases cho từng module nghiệp vụ

### Core Platform Modules
- **Commerce Module** - Quản lý sản phẩm, giỏ hàng, đơn hàng, nhà cung cấp
- **Payment Module** - Xử lý thanh toán, hóa đơn, đối soát
- **Rating & Review Module** - Đánh giá sản phẩm/dịch vụ, khiếu nại
- **Analytics Module** - Business Intelligence, báo cáo, dashboard
- **Orchestration Module** - Workflow engine, event bus, tích hợp bên thứ 3

## Cấu trúc thư mục

```
docs/
├── ba/                                # Business Analysis (Phân tích nghiệp vụ)
│   ├── README.md                      # ✅ File này - Hướng dẫn tổng quan
│   │
│   ├── 01-system-overview-BE.md       # ✅ Kiến trúc Backend (Laravel 12)
│   │                                  #    - Modular Monolith Architecture
│   │                                  #    - MVP + Services + Repository Pattern
│   │                                  #    - API Gateway & Middleware Pipeline
│   │                                  #    - Module Structure & Communication
│   │
│   ├── 01-system-overview-FE.md       # ✅ Kiến trúc Frontend (Nuxt.js 3)
│   │                                  #    - Feature-Sliced Design (FSD)
│   │                                  #    - Composition API + Pinia Stores
│   │                                  #    - API Integration với Composables
│   │                                  #    - Component Design Patterns
│   │                                  #    - TypeScript Types & Interfaces
│   │
│   ├── 02-stakeholder-analysis.md     # 📋 Phân tích các bên liên quan
│   │                                  #    - Cư dân, Nhà cung cấp, Admin, BQL
│   │
│   ├── 03-business-requirements.md    # 📋 Yêu cầu nghiệp vụ tổng quát
│   │                                  #    - Functional Requirements
│   │                                  #    - Non-Functional Requirements
│   │                                  #    - Business Rules & Constraints
│   │
│   ├── modules/                       # 📋 Chi tiết từng module nghiệp vụ
│   │   ├── orchestration-module.md    # Core Service - Workflow Engine
│   │   ├── commerce-module.md         # Thương mại - Product, Cart, Order
│   │   ├── payment-module.md          # Thanh toán - Payment, Invoice, Settlement
│   │   ├── rating-module.md           # Đánh giá - Rating, Review, Complaint
│   │   └── analytics-module.md        # Phân tích - BI, Reports, Dashboard
│   │
│   ├── workflows/                     # 📋 Luồng nghiệp vụ chi tiết
│   │   ├── commerce-workflows.md      # Shopping, Ordering, Vendor Management
│   │   ├── payment-workflows.md       # Payment Processing, Invoice Generation
│   │   ├── rating-workflows.md        # Rating, Review, Complaint Handling
│   │   └── orchestration-workflows.md # Workflow Execution, Event Processing
│   │
│   ├── questionnaires/                # 📋 Template câu hỏi cho khách hàng
│   │   ├── general-questions.md       # Câu hỏi tổng quan về hệ thống
│   │   ├── commerce-questions.md      # Câu hỏi về commerce module
│   │   ├── payment-questions.md       # Câu hỏi về payment module
│   │   ├── rating-questions.md        # Câu hỏi về rating module
│   │   └── edge-case-questions.md     # Câu hỏi về các trường hợp đặc biệt
│   │
│   └── diagrams/                      # 📋 Sơ đồ kiến trúc (PlantUML/Mermaid)
│       ├── system-context.puml        # Sơ đồ ngữ cảnh hệ thống tổng thể
│       ├── module-interaction.puml    # Sơ đồ tương tác giữa các modules
│       ├── data-flow.puml             # Sơ đồ luồng dữ liệu
│       ├── commerce-flow.puml         # Use case diagram - Commerce
│       ├── payment-flow.puml          # Use case diagram - Payment
│       └── rating-flow.puml           # Use case diagram - Rating
```

**Chú thích:**
- ✅ Đã hoàn thành
- 📋 Cần tạo/bổ sung

---

## Kiến Trúc Hệ Thống

### Backend Architecture (Laravel 12)

**Pattern:** Modular Monolith + MVP (Model-View-Presenter) + Services + Repository

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                      │
│  ┌──────────────────────┐    ┌───────────────────────────┐  │
│  │  Nuxt.js Web App     │    │ Resident Mobile Plugin    │  │
│  │  (Nuxt 3 + Vue 3)    │    │ (API Consumer)            │  │
│  └──────────────────────┘    └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               LARAVEL 12 - MODULAR MONOLITH                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   API GATEWAY LAYER                   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │   │
│  │  │ Auth Layer   │  │ Rate Limiter │  │ Validator  │ │   │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │   │
│  │  │ Router       │  │ Transformer  │  │ Logger     │ │   │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                               │
│              ┌───────────────┴──────────────┐               │
│              ▼                               ▼               │
│  ┌───────────────────────┐      ┌──────────────────────┐    │
│  │ Commerce Module       │      │ Orchestration Module │    │
│  │ - Product Catalog     │      │ - Workflow Engine    │    │
│  │ - Cart Management     │      │ - Job Scheduling     │    │
│  │ - Order Processing    │      │ - Event Bus          │    │
│  │ - Vendor Management   │      │ - Integration Hub    │    │
│  └───────────────────────┘      └──────────────────────┘    │
│              │                               │               │
│              └───────────┬───────────────────┘               │
│                          ▼                                   │
│          ┌───────────────────────────────┐                   │
│          │  Payment Module               │                   │
│          │  - Payment Processing         │                   │
│          │  - Transaction Management     │                   │
│          │  - Invoice Generation         │                   │
│          │  - Settlement Reconciliation  │                   │
│          └───────────────────────────────┘                   │
│                          │                                   │
│          ┌───────────────┴───────────────┐                   │
│          ▼                               ▼                   │
│  ┌──────────────────┐         ┌────────────────────┐        │
│  │ Rating Module    │         │  Analytics Module  │        │
│  │ - Rating System  │         │  - BI & Reports    │        │
│  │ - Review Mgmt    │         │  - Data Warehouse  │        │
│  │ - Complaint Mgmt │         │  - Dashboard       │        │
│  └──────────────────┘         └────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

#### Module Structure (MVP Pattern)

Mỗi module tuân theo cấu trúc:

```
app/Modules/{ModuleName}/
├── Models/              # Eloquent models (Domain entities)
├── Controllers/         # HTTP controllers (API endpoints)
├── Presenters/          # Data presentation layer
├── Requests/            # Form request validation
├── Services/            # Business logic layer
├── Repositories/        # Data access layer
├── Events/              # Domain events
├── Listeners/           # Event handlers
├── Jobs/                # Background jobs
└── routes/              # Module-specific routes
```

#### Core Principles
- **Modular Monolith**: Tổ chức code theo modules, dễ tách thành microservices sau này
- **MVP Pattern**: Controller → Service → Repository → Model, với Presenter format response
- **Event-Driven**: Modules giao tiếp qua Events, giảm coupling
- **API Gateway**: Centralized authentication, rate limiting, logging, transformation

### Frontend Architecture (Nuxt.js 3)

**Pattern:** Feature-Sliced Design (FSD) + Composition API + Pinia

```
┌────────────────────────────────────────────────────────────────┐
│                    NUXT.JS 3 APPLICATION                        │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              PRESENTATION LAYER                           │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │ │
│  │  │   Pages     │  │  Layouts    │  │ Components  │      │ │
│  │  │             │  │             │  │             │      │ │
│  │  │ - Shop      │  │ - Default   │  │ - UI Base   │      │ │
│  │  │ - Orders    │  │ - Admin     │  │ - Features  │      │ │
│  │  │ - Payment   │  │ - Dashboard │  │ - Common    │      │ │
│  │  │ - Reviews   │  │             │  │             │      │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              STATE MANAGEMENT (PINIA)                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │Commerce  │  │ Payment  │  │ Rating   │  │Analytics │ │ │
│  │  │  Store   │  │  Store   │  │  Store   │  │  Store   │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │
│  │  ┌──────────┐  ┌──────────┐                              │ │
│  │  │   Auth   │  │   Cart   │                              │ │
│  │  │  Store   │  │  Store   │                              │ │
│  │  └──────────┘  └──────────┘                              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │           API LAYER (Composables & Services)              │ │
│  │  ┌──────────────────────────────────────────────────────┐│ │
│  │  │          API Client Configuration                    ││ │
│  │  │  - Axios Instance with Interceptors                  ││ │
│  │  │  - Auth Token Management                             ││ │
│  │  │  - Error Handling & Retry Logic                      ││ │
│  │  └──────────────────────────────────────────────────────┘│ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│ │
│  │  │useCommerce│ │usePayment│  │useRating │  │useAnalytics││ │
│  │  │Composable│  │Composable│  │Composable│  │Composable││ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘│ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

#### Directory Structure (Feature-Sliced Design)

```
app/
├── pages/                    # File-based routing
│   ├── shop/                # Commerce routes
│   ├── orders/              # Order management
│   ├── payment/             # Payment routes
│   ├── reviews/             # Rating routes
│   └── dashboard/           # Analytics routes
│
├── components/
│   ├── ui/                  # Base UI components
│   ├── common/              # Shared components
│   └── features/            # Feature-specific components
│       ├── commerce/
│       ├── payment/
│       ├── rating/
│       └── analytics/
│
├── composables/
│   ├── api/                 # API composables
│   │   ├── useApi.ts
│   │   ├── useCommerce.ts
│   │   ├── usePayment.ts
│   │   └── useRating.ts
│   └── ui/                  # UI composables
│
├── stores/                  # Pinia stores
│   ├── commerce.ts
│   ├── payment.ts
│   ├── rating.ts
│   ├── cart.ts
│   └── auth.ts
│
└── types/                   # TypeScript types
    ├── api/
    └── models/
```

#### Core Principles
- **Feature-Sliced Design**: Tổ chức theo features, tương ứng 1:1 với backend modules
- **Composition API**: Vue 3 Composition API với `<script setup>`
- **Type Safety**: Full TypeScript với strict mode
- **Pinia Stores**: Mỗi module backend = 1 Pinia store
- **API Composables**: Reusable API logic với composables

## Module Mapping (Backend ↔ Frontend)

Mapping 1:1 giữa Backend modules và Frontend features đảm bảo consistency và dễ maintain:

| Backend Module | Module Purpose | Frontend Feature | Store | API Composable |
|----------------|----------------|------------------|-------|----------------|
| **Commerce** | Product catalog, cart, order management | `/shop/*`, `/orders/*` | `useCommerceStore()` | `useCommerce()` |
| **Payment** | Payment processing, invoices, transactions | `/payment/*` | `usePaymentStore()` | `usePayment()` |
| **Rating** | Product/service ratings, reviews, complaints | `/reviews/*`, `/complaints/*` | `useRatingStore()` | `useRating()` |
| **Analytics** | Business intelligence, reports, dashboard | `/dashboard/*` | `useAnalyticsStore()` | `useAnalytics()` |
| **Orchestration** | Background jobs, workflows, integrations | N/A (Backend only) | N/A | N/A |

### Communication Flow

```
Frontend Page → Pinia Store → API Composable → Backend API Gateway → Module Service → Repository → Model
     ↓               ↓              ↓                    ↓                    ↓           ↓          ↓
  User UI      State Mgmt    HTTP Request      Auth/Validation        Business Logic   Data Access  DB
```

### Communication Flow

```
Frontend Page → Pinia Store → API Composable → Backend API Gateway → Module Service → Repository → Model
     ↓               ↓              ↓                    ↓                    ↓           ↓          ↓
  User UI      State Mgmt    HTTP Request      Auth/Validation        Business Logic   Data Access  DB
```

---

## Cách Sử Dụng Tài Liệu

### 1. Business Analyst - Phân Tích Nghiệp Vụ

**Mục tiêu:** Thu thập yêu cầu, phân tích nghiệp vụ, xác nhận workflow với khách hàng

#### Workflow
1. **Hiểu kiến trúc tổng quan**
   - Đọc [01-system-overview-BE.md](01-system-overview-BE.md) - Backend architecture
   - Đọc [01-system-overview-FE.md](01-system-overview-FE.md) - Frontend architecture
   - Nắm rõ các modules: Commerce, Payment, Rating, Analytics, Orchestration

2. **Phỏng vấn khách hàng**
   - Sử dụng `questionnaires/general-questions.md` cho overview
   - Sử dụng `questionnaires/{module}-questions.md` cho từng module cụ thể
   - Focus vào: Pain points, Goals, Current process, Expectations

3. **Phân tích chi tiết module**
   - Đi qua từng file trong `modules/`:
     - `commerce-module.md` - Product catalog, cart, orders
     - `payment-module.md` - Payment processing, invoices
     - `rating-module.md` - Ratings, reviews, complaints
     - `analytics-module.md` - BI, reports, dashboard
   - Document requirements cho từng module

4. **Xác nhận workflow**
   - Review và update `workflows/` với khách hàng
   - Vẽ diagrams trong `diagrams/` nếu cần
   - Validate business rules và edge cases

### 2. Backend Developer - Laravel Implementation

**Mục tiêu:** Implement backend theo Modular Monolith + MVP pattern

#### Workflow
1. **Study kiến trúc**
   - **BẮT BUỘC đọc:** [01-system-overview-BE.md](01-system-overview-BE.md)
   - Hiểu rõ:
     - Modular Monolith Architecture
     - MVP (Model-View-Presenter) + Services + Repository Pattern
     - API Gateway & Middleware Pipeline
     - Module structure & inter-module communication
     - Event-driven architecture

2. **Setup project structure**
   - Tạo modules trong `app/Modules/{ModuleName}/`
   - Mỗi module có: Models, Controllers, Presenters, Requests, Services, Repositories
   - Setup routes trong `app/Modules/{ModuleName}/routes/`
   - Register routes trong `bootstrap/app.php`

3. **Implement theo pattern**
   ```
   Controller → Service → Repository → Model
                   ↓
              Presenter (format response)
   ```
   - **Controllers**: Handle HTTP requests, delegate to Services
   - **Services**: Business logic, orchestrate operations
   - **Repositories**: Data access, query optimization
   - **Presenters**: Format data for API responses
   - **Events**: Inter-module communication

4. **Follow Laravel 12 conventions**
   - Đọc `.github/copilot-instructions.md` - Laravel Boost guidelines
   - Use PHP 8.4 features (constructor property promotion, typed properties)
   - Form Requests cho validation
   - API Resources cho responses (hoặc Presenters)

5. **Testing**
   - Write PHPUnit tests cho mỗi Service, Repository
   - Run: `php artisan test --compact --filter=TestName`
   - Ensure code coverage cho business logic

### 3. Frontend Developer - Nuxt.js Implementation

**Mục tiêu:** Implement frontend theo Feature-Sliced Design

#### Workflow
1. **Study kiến trúc**
   - **BẮT BUỘC đọc:** [01-system-overview-FE.md](01-system-overview-FE.md)
   - Hiểu rõ:
     - Feature-Sliced Design (FSD)
     - Nuxt 3 + Vue 3 Composition API
     - Pinia Store structure (1 store per backend module)
     - API Composables pattern
     - Component design patterns (Smart vs Presentational)
     - TypeScript types & interfaces

2. **Setup project structure**
   - Create pages theo module mapping:
     - `pages/shop/` → Commerce module
     - `pages/payment/` → Payment module
     - `pages/reviews/` → Rating module
     - `pages/dashboard/` → Analytics module

3. **Implement features**
   - **Components**: Tổ chức theo `components/features/{module}/`
     - Smart components (container): Handle logic, API calls
     - Presentational components: Pure UI, props-based

   - **Pinia Stores**: 1 store per module
     ```typescript
     stores/commerce.ts  → Commerce module
     stores/payment.ts   → Payment module
     stores/rating.ts    → Rating module
     stores/analytics.ts → Analytics module
     stores/cart.ts      → Shopping cart (special)
     ```

   - **API Composables**: Reusable API logic
     ```typescript
     composables/api/useCommerce.ts  → Commerce API
     composables/api/usePayment.ts   → Payment API
     composables/api/useRating.ts    → Rating API
     composables/api/useAnalytics.ts → Analytics API
     ```

4. **UI Development**
   - Base UI components trong `components/ui/`
   - Follow Tailwind CSS patterns
   - Responsive design (mobile-first)
   - Dark mode support nếu cần

5. **Type Safety**
   - Define types trong `types/`:
     - `types/api/` - API response types
     - `types/models/` - Domain models
   - Use TypeScript strict mode
   - Validate props với interfaces

6. **Testing**
   - Unit tests (Vitest): Test composables, utilities
   - Component tests: Test UI logic
   - E2E tests (Playwright): Critical user flows
   - Run: `npm run test`

### 4. Full-Stack Integration

**Mục tiêu:** Đảm bảo Frontend và Backend work together seamlessly

#### Workflow
1. **API Contract Agreement**
   - Backend developer publish API documentation
   - Frontend developer review và confirm API structure
   - Agree on:
     - Request/Response formats (DTOs)
     - Error handling structure
     - Status codes
     - Pagination format

2. **Development Process**
   - Backend: Implement API endpoints first
   - Backend: Write tests to validate API
   - Frontend: Implement API composables based on contracts
   - Frontend: Create UI components
   - Both: Test integration

3. **Testing Integration**
   - Backend: `php artisan test --compact`
   - Frontend: `npm run test`
   - E2E: Test critical flows (ordering, payment, etc.)

4. **Validation with BA**
   - BA validates implemented features against requirements
   - Check workflows in `workflows/`
   - Verify business rules
   - Test edge cases

---

## Quy Trình Làm Việc (Development Workflow)

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Khám phá & Tổng quan                                │
│ - BA: Đọc system-overview-BE.md & FE.md                     │
│ - BA: Phỏng vấn với general-questions.md                    │
│ - BA: Xác định stakeholders (stakeholder-analysis.md)       │
│ - BA + Dev: Review kiến trúc và tech stack                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Phân tích chi tiết module                          │
│ - BA: Đi qua từng module trong modules/                     │
│ - BA: Sử dụng {module}-questions.md cho từng module         │
│ - BA: Vẽ và xác nhận workflows/                             │
│ - Dev: Review feasibility & technical constraints           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Thiết kế Architecture (Backend & Frontend)         │
│ Backend Dev: Study 01-system-overview-BE.md                 │
│   • Modular Monolith, MVP pattern, Repository pattern       │
│   • API Gateway, Middleware pipeline                        │
│   • Event-driven communication                              │
│ Frontend Dev: Study 01-system-overview-FE.md                │
│   • Feature-Sliced Design, Pinia stores                     │
│   • API composables, Component patterns                     │
│   • TypeScript types & validation                           │
│ Both: Align API contracts & data flow                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: Implementation                                      │
│ Backend (Laravel 12):                                        │
│ - Setup modules theo structure trong BE doc                 │
│ - Implement Models, Services, Repositories, Presenters      │
│ - Setup Routes, Middleware, API Resources                   │
│ - Write PHPUnit tests for business logic                    │
│                                                              │
│ Frontend (Nuxt.js 3):                                        │
│ - Setup Feature-Sliced structure                            │
│ - Implement Pages, Components, Layouts                      │
│ - Setup Pinia Stores & API Composables                      │
│ - Build UI với Tailwind CSS v4                              │
│ - Write Vitest unit tests & Playwright E2E tests            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 5: Integration & Testing                              │
│ - Backend: Run `php artisan test --compact`                 │
│ - Frontend: Run `npm run test` & E2E tests                  │
│ - Integration testing: Frontend ↔ Backend API               │
│ - BA: Validate against business requirements                │
│ - Fix bugs and refine based on feedback                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices & Guidelines

### Backend (Laravel 12)
- ✅ Follow `.github/copilot-instructions.md` - Laravel Boost guidelines
- ✅ Use PHP 8.4 features: Constructor property promotion, typed properties
- ✅ Form Requests for all validation logic
- ✅ Service layer for business logic, keep controllers thin
- ✅ Repository pattern for data access
- ✅ Events for inter-module communication
- ✅ PHPUnit tests with good coverage
- ✅ Run Laravel Pint before committing: `vendor/bin/pint --format agent`

### Frontend (Nuxt.js 3)
- ✅ TypeScript strict mode enabled
- ✅ Composition API with `<script setup>` syntax
- ✅ 1 Pinia store per backend module
- ✅ API composables for all API calls
- ✅ Smart vs Presentational component pattern
- ✅ Tailwind CSS v4 for styling
- ✅ Responsive & mobile-first design
- ✅ Unit tests (Vitest) + E2E tests (Playwright)

### Integration
- ✅ API contracts agreed upon before implementation
- ✅ Consistent error handling structure
- ✅ Proper HTTP status codes
- ✅ Pagination format standardized
- ✅ Authentication via Bearer tokens
- ✅ Rate limiting configured

---

## Khi Nào Sử Dụng Tài Liệu Nào

### Business Analyst
| Tài liệu | Khi nào dùng |
|----------|--------------|
| `01-system-overview-BE.md` | Hiểu kiến trúc backend, modules, patterns |
| `01-system-overview-FE.md` | Hiểu kiến trúc frontend, features, components |
| `questionnaires/` | Phỏng vấn khách hàng, thu thập requirements |
| `modules/` | Phân tích chi tiết nghiệp vụ từng module |
| `workflows/` | Xác nhận và validate luồng nghiệp vụ |
| `diagrams/` | Visualize hệ thống cho stakeholders |

### Backend Developer
| Tài liệu | Khi nào dùng |
|----------|--------------|
| `01-system-overview-BE.md` | **BẮT BUỘC** - Architecture guide, patterns |
| `.github/copilot-instructions.md` | Laravel 12 coding standards |
| `workflows/` | Hiểu business flows để implement đúng |
| `modules/` | Chi tiết requirements cho module |

### Frontend Developer
| Tài liệu | Khi nào dùng |
|----------|--------------|
| `01-system-overview-FE.md` | **BẮT BUỘC** - Architecture guide, patterns |
| `01-system-overview-BE.md` | Hiểu API structure và data models |
| `workflows/` | Hiểu business flows để implement UI |
| `modules/` | Chi tiết requirements cho features |

---

## Câu Hỏi Cần Làm Rõ Với Khách Hàng

Vì đây là hệ thống mới, BA cần tập trung vào:

### 1. Vấn đề hiện tại
- Khách hàng đang gặp vấn đề gì trong quản lý khu dân cư?
- Pain points của cư dân và ban quản lý?
- Quy trình thủ công nào tốn thời gian nhất?

### 2. Mục tiêu
- Khách hàng muốn đạt được gì với hệ thống này?
- KPIs để đo lường thành công?
- Timeline và milestones mong đợi?

### 3. Quy trình hiện tại
- Khách hàng đang quản lý thương mại/dịch vụ như thế nào?
- Thanh toán được xử lý ra sao?
- Khiếu nại được giải quyết thế nào?

### 4. Kỳ vọng
- Khách hàng mong muốn hệ thống hoạt động như thế nào?
- Tính năng nào là must-have vs nice-to-have?
- User experience mong đợi?

### 5. Constraints
- Budget và resources có sẵn?
- Timeline deadline cứng?
- Technical constraints (hosting, infrastructure)?

### 6. Integration
- Có hệ thống nào cần tích hợp? (Payment gateway, ERP, etc.)
- APIs của bên thứ 3 nào cần connect?
- Data migration từ hệ thống cũ?

---

## Tech Stack Summary

### Backend
- **Framework**: Laravel 12
- **PHP**: 8.4
- **Database**: PostgreSQL/MySQL
- **Testing**: PHPUnit 11
- **Code Style**: Laravel Pint
- **Pattern**: Modular Monolith + MVP + Services + Repository

### Frontend
- **Framework**: Nuxt.js 3
- **Runtime**: Vue 3 Composition API
- **Language**: TypeScript (strict mode)
- **State**: Pinia
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Pattern**: Feature-Sliced Design

### DevOps
- **Containerization**: Docker + Sail
- **CI/CD**: GitHub Actions (TBD)
- **Monitoring**: Laravel Telescope (dev)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-05 | BA Team | Initial documentation structure |
| 2.0 | 2026-02-05 | Dev Team | Added detailed BE & FE architecture |

## Contact & Support

Vui lòng liên hệ với BA team hoặc Tech Lead nếu có câu hỏi hoặc cần clarification về tài liệu này.

---

**Lưu ý:** Tài liệu này sẽ được cập nhật liên tục trong quá trình phát triển dự án.

