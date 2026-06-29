<?php

use App\Modules\Marketplace\Partner\Controllers\PartnerController;
use App\Modules\Marketplace\Partner\Controllers\PlatformPartnerRatingController;
use App\Modules\Marketplace\PartnerCommissionContract\Controllers\PartnerCommissionContractController;
use App\Modules\Marketplace\PartnerProject\Controllers\PlatformProjectVendorController;
use App\Modules\Marketplace\VendorOffer\Controllers\PlatformVendorOfferController;
use App\Modules\Marketplace\VendorOrder\Controllers\PlatformVendorOrderController;
use Illuminate\Support\Facades\Route;

/**
 * Platform-level Marketplace endpoints — operate on central `partners` table.
 * Mounted under `/api/v1/platform` with `auth:requester` guard (platform admin).
 */
Route::middleware('auth:requester')->group(function (): void {
    Route::get('partners', [PartnerController::class, 'index']);
    // Literal `stats` must be declared before the `{id}` wildcard.
    Route::get('partners/stats', [PartnerController::class, 'stats']);
    Route::post('partners', [PartnerController::class, 'store']);
    Route::get('partners/{id}', [PartnerController::class, 'show']);
    Route::put('partners/{id}', [PartnerController::class, 'update']);
    Route::delete('partners/{id}', [PartnerController::class, 'destroy']);
    Route::post('partners/{id}/provision', [PartnerController::class, 'provision']);

    // Approval flow — vendor lifecycle (pending → active → suspended → active).
    Route::post('partners/{id}/approve', [PartnerController::class, 'approve']);
    Route::post('partners/{id}/deactivate', [PartnerController::class, 'deactivate']);
    Route::post('partners/{id}/reactivate', [PartnerController::class, 'reactivate']);

    // Apply default commission terms to every project the vendor is linked to.
    Route::post('partners/{id}/commission-contracts/bulk', [PartnerCommissionContractController::class, 'bulkDefaults']);

    // Console gộp "Đơn hàng vendor" — ĐỌC-CHỈ cross-vendor + cross-tenant.
    // `summary` khai báo trước route động khác để tránh nuốt path.
    Route::get('vendor-orders/summary', [PlatformVendorOrderController::class, 'allSummary']);
    Route::get('vendor-orders', [PlatformVendorOrderController::class, 'allIndex']);

    // Vendor orders — đọc cross-DB từ resi_mart, gom mọi PMC tenant của vendor.
    Route::get('partners/{partnerId}/revenue-trend', [PlatformVendorOrderController::class, 'revenueTrend']);
    Route::get('partners/{partnerId}/orders/summary', [PlatformVendorOrderController::class, 'summary']);
    Route::get('partners/{partnerId}/orders', [PlatformVendorOrderController::class, 'index']);
    Route::get('partners/{partnerId}/orders/{orderId}', [PlatformVendorOrderController::class, 'show']);

    // Override trạng thái 1 đơn vendor (any→any) — ghi qua S2S resi_mart.
    Route::patch('partners/{partnerId}/orders/{orderId}/status', [PlatformVendorOrderController::class, 'updateStatus']);

    // Gán / gỡ hoa hồng thủ công cho đơn vendor mồ côi (đã hoàn thành, chưa có hợp đồng).
    Route::put('partners/{partnerId}/orders/{orderId}/commission-override', [PlatformVendorOrderController::class, 'assignCommission']);
    Route::delete('partners/{partnerId}/orders/{orderId}/commission-override', [PlatformVendorOrderController::class, 'removeCommission']);

    // Vendor offers (sản phẩm) — đọc cross-DB từ catalog resi_mart của vendor.
    Route::get('partners/{partnerId}/offers', [PlatformVendorOfferController::class, 'index']);

    // Đánh giá cư dân theo vendor — DEFERRED part2 (chưa có link partner_id).
    Route::get('partners/{partnerId}/ratings', [PlatformPartnerRatingController::class, 'index']);

    // Vendor trên 1 dự án — danh sách + công tắc tạm dừng cung cấp dịch vụ.
    Route::get('tenants/{tenantId}/projects/{projectId}/vendors', [PlatformProjectVendorController::class, 'index']);
    Route::put('tenants/{tenantId}/projects/{projectId}/vendors/{partnerId}/toggle', [PlatformProjectVendorController::class, 'toggle']);

    // Commission contracts (financial-immutable vendor agreements).
    Route::prefix('partner-commission-contracts')->group(function (): void {
        Route::get('/', [PartnerCommissionContractController::class, 'index']);
        Route::post('/', [PartnerCommissionContractController::class, 'store']);
        Route::get('/{id}', [PartnerCommissionContractController::class, 'show']);
        Route::put('/{id}', [PartnerCommissionContractController::class, 'update']);
        Route::patch('/{id}/notes', [PartnerCommissionContractController::class, 'updateNotes']);
        Route::delete('/{id}', [PartnerCommissionContractController::class, 'destroy']);
        Route::post('/{id}/sign', [PartnerCommissionContractController::class, 'sign']);
        Route::post('/{id}/revoke', [PartnerCommissionContractController::class, 'revoke']);
        Route::post('/{id}/cancel', [PartnerCommissionContractController::class, 'cancel']);
    });
});
