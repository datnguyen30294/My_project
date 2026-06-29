<?php

use App\Modules\Platform\ExternalApi\Controllers\ApiClientController;
use App\Modules\Platform\ExternalApi\Controllers\ApiScopeController;
use App\Modules\Platform\ExternalApi\Controllers\OrganizationLookupController;
use App\Modules\Platform\Report\Controllers\CommissionAllocationReportController;
use App\Modules\Platform\Report\Controllers\CsatReportController;
use App\Modules\Platform\Report\Controllers\ReportOverviewController;
use App\Modules\Platform\Report\Controllers\ResidentSegmentReportController;
use App\Modules\Platform\Report\Controllers\RevenueReportController;
use App\Modules\Platform\Report\Controllers\ServiceAdoptionReportController;
use App\Modules\Platform\Report\Controllers\TenantHealthReportController;
use App\Modules\Platform\Report\Controllers\VendorScorecardReportController;
use App\Modules\Platform\Tenant\Controllers\ListPlatformProjectController;
use App\Modules\Platform\Tenant\Controllers\OrganizationController;
use App\Modules\Platform\Tenant\Controllers\PlatformProjectBusinessSummaryController;
use App\Modules\Platform\Tenant\Controllers\PlatformProjectController;
use App\Modules\Platform\Tenant\Controllers\PlatformProjectFeeConfigController;
use App\Modules\Platform\Tenant\Controllers\PlatformProjectOrderController;
use App\Modules\Platform\Tenant\Controllers\PlatformProjectResidentRatingController;
use App\Modules\Platform\Tenant\Controllers\TenantAccountController;
use App\Modules\Platform\Tenant\Controllers\TenantBusinessSummaryController;
use App\Modules\Platform\Tenant\Controllers\TenantProjectController;
use App\Modules\Platform\Tenant\Controllers\TenantResidentRatingController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:requester')->group(function (): void {
    Route::get('api-clients', [ApiClientController::class, 'index']);
    Route::post('api-clients', [ApiClientController::class, 'store']);
    Route::get('api-clients/{id}', [ApiClientController::class, 'show']);
    Route::put('api-clients/{id}', [ApiClientController::class, 'update']);
    Route::delete('api-clients/{id}', [ApiClientController::class, 'destroy']);
    Route::post('api-clients/{id}/regenerate-secret', [ApiClientController::class, 'regenerateSecret']);

    Route::get('api-scopes', [ApiScopeController::class, 'index']);

    Route::get('organizations', [OrganizationLookupController::class, 'organizations']);
    Route::get('organizations/{orgId}/projects', [OrganizationLookupController::class, 'projects']);

    Route::get('tenants', [OrganizationController::class, 'index']);
    Route::post('tenants', [OrganizationController::class, 'store']);
    Route::get('tenants/stats', [OrganizationController::class, 'stats']);
    Route::get('tenants/{id}', [OrganizationController::class, 'show']);
    Route::put('tenants/{id}', [OrganizationController::class, 'update']);
    Route::delete('tenants/{id}', [OrganizationController::class, 'destroy']);
    Route::put('tenants/{id}/vendor-feature', [OrganizationController::class, 'toggleVendorFeature']);
    Route::put('tenants/{id}/toggle-active', [OrganizationController::class, 'toggleActive']);
    Route::put('tenants/{id}/config', [OrganizationController::class, 'updateConfig']);

    Route::get('tenants/{id}/accounts', [TenantAccountController::class, 'index']);
    Route::get('tenants/{id}/accounts/options', [TenantAccountController::class, 'options']);
    Route::post('tenants/{id}/accounts', [TenantAccountController::class, 'store']);
    Route::put('tenants/{id}/accounts/{accountId}', [TenantAccountController::class, 'update']);

    Route::get('tenants/{id}/projects', [TenantProjectController::class, 'index']);

    Route::get('tenants/{id}/resident-ratings', [TenantResidentRatingController::class, 'index']);

    Route::get('tenants/{id}/business-summary', [TenantBusinessSummaryController::class, 'index']);

    // Platform-wide project console (cross-tenant list + per-project management).
    Route::get('projects', [ListPlatformProjectController::class, 'index']);
    Route::post('tenants/{id}/projects', [PlatformProjectController::class, 'store']);
    Route::get('tenants/{id}/projects/{projectId}', [PlatformProjectController::class, 'show']);
    Route::get('tenants/{id}/projects/{projectId}/business-summary', [PlatformProjectBusinessSummaryController::class, 'index']);
    Route::get('tenants/{id}/projects/{projectId}/orders', [PlatformProjectOrderController::class, 'index']);
    Route::get('tenants/{id}/projects/{projectId}/resident-ratings', [PlatformProjectResidentRatingController::class, 'index']);
    Route::get('tenants/{id}/projects/{projectId}/fee-config', [PlatformProjectFeeConfigController::class, 'show']);
    Route::put('tenants/{id}/projects/{projectId}/fee-config', [PlatformProjectFeeConfigController::class, 'update']);

    Route::get('reports/overview', [ReportOverviewController::class, 'index']);
    Route::get('reports/revenue', [RevenueReportController::class, 'index']);
    Route::get('reports/csat', [CsatReportController::class, 'index']);
    Route::get('reports/service-adoption', [ServiceAdoptionReportController::class, 'index']);
    Route::get('reports/resident-segments', [ResidentSegmentReportController::class, 'index']);
    Route::get('reports/tenant-health', [TenantHealthReportController::class, 'index']);
    Route::get('reports/commission-allocation', [CommissionAllocationReportController::class, 'index']);
    Route::get('reports/vendor-scorecard', [VendorScorecardReportController::class, 'index']);
});
