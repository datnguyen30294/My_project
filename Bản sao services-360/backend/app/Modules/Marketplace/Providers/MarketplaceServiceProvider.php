<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Providers;

use App\Modules\Marketplace\ExternalServices\Platform\PlatformVendorOrderAggregationExternalService;
use App\Modules\Marketplace\ExternalServices\PMC\PartnerCommissionContractExternalService;
use App\Modules\Marketplace\ExternalServices\PMC\VendorOrderReportExternalService;
use App\Modules\Marketplace\Partner\Contracts\PartnerServiceInterface;
use App\Modules\Marketplace\Partner\ExternalServices\ResiMartOrderStatusService;
use App\Modules\Marketplace\Partner\ExternalServices\ResiMartOrderStatusServiceInterface;
use App\Modules\Marketplace\Partner\ExternalServices\ResiMartProvisioningService;
use App\Modules\Marketplace\Partner\ExternalServices\ResiMartProvisioningServiceInterface;
use App\Modules\Marketplace\Partner\Services\PartnerService;
use App\Modules\Marketplace\PartnerCommissionContract\Contracts\PartnerCommissionContractServiceInterface;
use App\Modules\Marketplace\PartnerCommissionContract\ExternalServices\PartnerCommissionContractExternalServiceInterface;
use App\Modules\Marketplace\PartnerCommissionContract\Services\PartnerCommissionContractService;
use App\Modules\Marketplace\PartnerProject\Contracts\ProjectVendorServiceInterface;
use App\Modules\Marketplace\PartnerProject\Services\ProjectVendorService;
use App\Modules\Marketplace\VendorOffer\Contracts\VendorOfferServiceInterface;
use App\Modules\Marketplace\VendorOffer\Services\VendorOfferService;
use App\Modules\Marketplace\VendorOrder\Contracts\VendorOrderServiceInterface;
use App\Modules\Marketplace\VendorOrder\ExternalServices\VendorOrderReportExternalServiceInterface;
use App\Modules\Marketplace\VendorOrder\Services\VendorOrderService;
use App\Modules\PMC\ExternalServices\Marketplace\ProjectExternalService;
use App\Modules\PMC\ExternalServices\Marketplace\ProjectExternalServiceInterface;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class MarketplaceServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PartnerServiceInterface::class, PartnerService::class);
        $this->app->bind(ResiMartProvisioningServiceInterface::class, ResiMartProvisioningService::class);
        $this->app->bind(ResiMartOrderStatusServiceInterface::class, ResiMartOrderStatusService::class);
        $this->app->bind(
            PartnerCommissionContractServiceInterface::class,
            PartnerCommissionContractService::class,
        );
        $this->app->bind(
            PartnerCommissionContractExternalServiceInterface::class,
            PartnerCommissionContractExternalService::class,
        );
        $this->app->bind(ProjectVendorServiceInterface::class, ProjectVendorService::class);
        $this->app->bind(VendorOfferServiceInterface::class, VendorOfferService::class);
        $this->app->bind(VendorOrderServiceInterface::class, VendorOrderService::class);
        $this->app->bind(
            VendorOrderReportExternalServiceInterface::class,
            VendorOrderReportExternalService::class,
        );
        $this->app->bind(
            \App\Modules\Platform\Report\Contracts\PlatformVendorOrderAggregationExternalServiceInterface::class,
            PlatformVendorOrderAggregationExternalService::class,
        );
        $this->app->bind(ProjectExternalServiceInterface::class, ProjectExternalService::class);
    }

    public function boot(): void
    {
        $this->loadRoutes();
    }

    protected function loadRoutes(): void
    {
        // Platform admin — central `partners` CRUD.
        Route::prefix('api/v1/platform')
            ->middleware('api')
            ->group(base_path('app/Modules/Marketplace/routes/platform.php'));

        // PMC tenant — central `partners` CRUD scoped to current tenant.
        Route::prefix('api/v1/pmc')
            ->middleware(['api', 'tenant', 'tenant.active', 'auth:sanctum'])
            ->group(base_path('app/Modules/Marketplace/routes/tenant.php'));
    }
}
