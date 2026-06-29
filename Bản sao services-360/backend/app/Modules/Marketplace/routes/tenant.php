<?php

use App\Modules\Marketplace\Partner\Controllers\TenantPartnerController;
use App\Modules\Marketplace\PartnerCommissionContract\Controllers\TenantPartnerCommissionContractController;
use App\Modules\Marketplace\VendorOrder\Controllers\TenantVendorOrderController;
use Illuminate\Support\Facades\Route;

/**
 * Tenant-scoped Marketplace endpoints — operate on the central `partners`
 * table, automatically filtered by current tenant's `owner_tenant_id`.
 *
 * Mounted under `/api/v1/pmc` with `tenant` + `auth:sanctum`. Each route
 * additionally requires the tenant to have the vendor feature enabled.
 */
Route::prefix('partners')->middleware('tenant.vendor_enabled')->group(function (): void {
    Route::get('/', [TenantPartnerController::class, 'index']);
    Route::get('/catalog', [TenantPartnerController::class, 'catalog']);
    Route::get('/{id}', [TenantPartnerController::class, 'show']);
    Route::put('/{id}', [TenantPartnerController::class, 'update']);
    Route::delete('/{id}', [TenantPartnerController::class, 'destroy']);
    Route::post('/{id}/detach', [TenantPartnerController::class, 'detach']);

    // Đăng ký vendor mới — yêu cầu portal "đăng ký dịch vụ" được platform bật.
    Route::middleware('tenant.portal:partner')->group(function (): void {
        Route::post('/', [TenantPartnerController::class, 'store']);
        Route::post('/{id}/provision', [TenantPartnerController::class, 'provision']);
        Route::post('/{id}/attach', [TenantPartnerController::class, 'attach']);
    });

    // Vendor orders — đọc cross-DB từ resi_mart
    Route::get('/{partnerId}/orders/summary', [TenantVendorOrderController::class, 'summary']);
    Route::get('/{partnerId}/orders', [TenantVendorOrderController::class, 'index']);
    Route::get('/{partnerId}/orders/{orderId}', [TenantVendorOrderController::class, 'show']);
});

// Vendor orders gom theo tenant — list/summary đơn + hoa hồng của TẤT CẢ vendor.
Route::prefix('vendor-orders')->middleware('tenant.vendor_enabled')->group(function (): void {
    Route::get('/summary', [TenantVendorOrderController::class, 'allSummary']);
    Route::get('/', [TenantVendorOrderController::class, 'all']);
});

// Commission contracts — full CRUD mirror of platform side, auto-scoped to
// current tenant. Mounted at `/api/v1/pmc/partner-commission-contracts`.
Route::prefix('partner-commission-contracts')->middleware('tenant.vendor_enabled')->group(function (): void {
    Route::get('/', [TenantPartnerCommissionContractController::class, 'index']);
    Route::post('/', [TenantPartnerCommissionContractController::class, 'store']);
    Route::get('/history', [TenantPartnerCommissionContractController::class, 'history']);
    Route::get('/{id}', [TenantPartnerCommissionContractController::class, 'show']);
    Route::put('/{id}', [TenantPartnerCommissionContractController::class, 'update']);
    Route::patch('/{id}/notes', [TenantPartnerCommissionContractController::class, 'updateNotes']);
    Route::delete('/{id}', [TenantPartnerCommissionContractController::class, 'destroy']);
    Route::post('/{id}/sign', [TenantPartnerCommissionContractController::class, 'sign']);
    Route::post('/{id}/revoke', [TenantPartnerCommissionContractController::class, 'revoke']);
    Route::post('/{id}/switch', [TenantPartnerCommissionContractController::class, 'switch']);
    Route::post('/{id}/cancel', [TenantPartnerCommissionContractController::class, 'cancel']);
});
