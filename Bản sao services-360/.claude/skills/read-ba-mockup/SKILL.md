---
name: read-ba-mockup
description: >-
  Reads feature requirements from BA-TNP-SERVICES mockup project and generates implementation-ready
  specifications. Activates when the user wants to read mockup, extract requirements, or prepare
  specs from the mockup project before implementing features. Handles listing all features,
  reading specific feature details, and converting mockup specs to backend/frontend implementation format.
---

# Read BA Mockup

## When to Apply

- User says "đọc mockup", "read mockup", "xem mockup"
- User wants to know what features exist in the mockup
- User wants to implement a feature that exists in the mockup
- User says "triển khai từ mockup", "implement from mockup"
- User references BA-TNP-SERVICES content

## Overview

The `BA-TNP-SERVICES/` directory contains a Nuxt.js mockup/prototype project with:
- **Documentation** (content/docs/*.md) — business rules, data flows, CRUD specs
- **Entity definitions** (app/stores/entities/*.ts) — Pinia ORM models with fields and relationships
- **Mock data** (app/mock/**/*.ts) — TypeScript interfaces, enums, sample data
- **Working UI pages** (app/pages/modules/**/*.vue) — form fields, table columns, filters, validation
- **Module registry** (app/stores/mockup.ts) — all modules and sub-modules

## Available Features in Mockup

### Module: HRM (Quản lý nhân sự) — FULLY IMPLEMENTED
| Sub-module | Docs | Entity | Page | Mock |
|-----------|------|--------|------|------|
| Tài khoản | `content/docs/hrm/tai-khoan.md` | `HrmAccount.ts` | `hrm/tai-khoan.vue` | `hrm/tai-khoan.ts` |
| Phòng ban | `content/docs/hrm/phong-ban.md` | `HrmDepartment.ts` | `hrm/phong-ban.vue` | `hrm/phong-ban.ts` |
| Chức danh | `content/docs/hrm/chuc-danh.md` | `HrmJobTitle.ts` | `hrm/chuc-danh.vue` | `hrm/chuc-danh.ts` |
| Quản lý dự án | `content/docs/hrm/quan-ly-du-an.md` | `HrmProject.ts` + `HrmAccountProject.ts` | `hrm/quan-ly-du-an/` | `hrm/du-an.ts` + `hrm/account-project.ts` |
| Danh sách nhân sự | `content/docs/hrm/danh-sach-nhan-su.md` | — | — | — |

### Module: Quản lý đơn hàng — DOCS ONLY
| Sub-module | Docs |
|-----------|------|
| Tạo đơn mới | `content/docs/quan-ly-don-hang/tao-don-moi.md` |

### Module: Báo cáo — PLACEHOLDER
### Module: Cài đặt hệ thống — PLACEHOLDER

## Workflow

### Mode 1: List All Features

When user asks "có gì trong mockup?" or "list mockup features":

1. Read `BA-TNP-SERVICES/app/stores/mockup.ts` for complete module registry
2. Scan `BA-TNP-SERVICES/content/docs/` for documentation coverage
3. Scan `BA-TNP-SERVICES/app/stores/entities/` for entity coverage
4. Scan `BA-TNP-SERVICES/app/pages/modules/` for UI coverage
5. Present structured overview with implementation status

### Mode 2: Read Specific Feature

When user specifies a feature (e.g., "đọc mockup tài khoản"):

1. **Use `ba-mockup-reader` agent** to read documentation and extract business rules
2. **Use `ba-mockup-feature-extractor` agent** to extract technical specs from code
3. Present combined results

**Alternatively, read directly:**

#### Step 1: Read Documentation
Read `BA-TNP-SERVICES/content/docs/{module}/{feature}.md`
- Extract: overview, business rules, CRUD specs, data flow diagrams

#### Step 2: Read Entity Definition
Read `BA-TNP-SERVICES/app/stores/entities/{Entity}.ts`
- Extract: fields, types, relationships

#### Step 3: Read Mock Data Types
Read `BA-TNP-SERVICES/app/mock/{module}/{feature}.ts`
- Extract: TypeScript interfaces, enums, sample values

#### Step 4: Read Mockup Page
Read `BA-TNP-SERVICES/app/pages/modules/{module}/{feature}.vue`
- Extract: form fields, table columns, filters, validation, delete constraints

#### Step 5: Generate Spec
Combine all extracted data into the `analyze-domain` spec format.

### Mode 3: Generate Implementation Spec

When user wants to implement (e.g., "triển khai tài khoản từ mockup"):

1. Read all mockup sources (docs + entity + mock + page)
2. Generate spec in `analyze-domain` format at `docs/ba/modules/{module}/{feature}.md`
3. Map mockup types to Laravel types:

| Mockup (TS/ORM) | Laravel Type | Migration |
|-----------------|-------------|-----------|
| `this.string('')` | `string` | `$table->string('name')` |
| `this.attr('')` / FK | `unsignedBigInteger` | `$table->foreignId('x_id')` |
| `this.attr(null)` | `?unsignedBigInteger` | `$table->foreignId('x_id')->nullable()` |
| `this.boolean(true)` | `boolean` | `$table->boolean('is_active')->default(true)` |
| TypeScript union | Enum class | `$table->string('status', 50)` |
| `belongsTo` | `belongsTo()` | FK on this table |
| `hasMany` | `hasMany()` | FK on child table |
| `belongsToMany` | `belongsToMany()` | Pivot table |

4. Map mockup field names to Laravel conventions:

| Mockup Field | Laravel Column | Notes |
|-------------|---------------|-------|
| `id` (string in mockup) | `id` (auto-increment) | Mockup uses string IDs |
| `departmentId` | `department_id` | camelCase → snake_case |
| `fullName` | `full_name` | camelCase → snake_case |
| `employeeCode` | `employee_code` | camelCase → snake_case |
| `parentId` | `parent_id` | Self-referential FK |
| `active` (boolean) | `is_active` | Add `is_` prefix for booleans |

## Feature-to-Module Mapping (Mockup → Backend)

| Mockup Feature | Backend Module | Sub-module |
|---------------|---------------|------------|
| HRM > Tài khoản | `HRM/` or existing module | `Account/` |
| HRM > Phòng ban | `HRM/` | `Department/` |
| HRM > Chức danh | `HRM/` | `JobTitle/` |
| HRM > Quản lý dự án | `HRM/` | `Project/` |
| HRM > Danh sách nhân sự | `HRM/` | `Employee/` or `Staff/` |
| Quản lý đơn hàng | `Order/` | `Order/` |

## Output

Always present results in a structured, scannable format. Include:
- Business rules as bullet points
- Entity fields in table format
- Relationships clearly listed
- Enums with values and Vietnamese labels
- CRUD operation details
- Validation rules from form logic
- Any special business logic (delete protection, cascade, computed fields)
