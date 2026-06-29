<?php

namespace App\Modules\PMC\Report\VendorOrder\Controllers;

use App\Common\Controllers\BaseController;
use App\Modules\PMC\Report\VendorOrder\Contracts\VendorOrderReportServiceInterface;
use App\Modules\PMC\Report\VendorOrder\Requests\VendorOrderReportRequest;
use App\Modules\PMC\Report\VendorOrder\Resources\VendorOrderReportByProjectResource;
use App\Modules\PMC\Report\VendorOrder\Resources\VendorOrderReportByVendorResource;
use App\Modules\PMC\Report\VendorOrder\Resources\VendorOrderReportSummaryResource;
use App\Modules\PMC\Report\VendorOrder\Resources\VendorOrderReportTrendResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

/**
 * @tags Vendor Order Report
 */
class VendorOrderReportController extends BaseController implements HasMiddleware
{
    public function __construct(
        protected VendorOrderReportServiceInterface $service,
    ) {}

    /**
     * @return list<Middleware>
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:report-vendor-order.view'),
        ];
    }

    /**
     * Summary KPIs: tổng đơn completed, doanh thu, hoa hồng, số vendor / dự án.
     */
    public function summary(VendorOrderReportRequest $request): VendorOrderReportSummaryResource
    {
        return new VendorOrderReportSummaryResource($this->service->getSummary($request->validated()));
    }

    /**
     * Tổng hợp theo từng vendor.
     */
    public function byVendor(VendorOrderReportRequest $request): AnonymousResourceCollection
    {
        return VendorOrderReportByVendorResource::collection($this->service->getByVendor($request->validated()))
            ->additional(['success' => true]);
    }

    /**
     * Tổng hợp theo từng dự án.
     */
    public function byProject(VendorOrderReportRequest $request): AnonymousResourceCollection
    {
        return VendorOrderReportByProjectResource::collection($this->service->getByProject($request->validated()))
            ->additional(['success' => true]);
    }

    /**
     * Chuỗi theo ngày (completed_at).
     */
    public function trend(VendorOrderReportRequest $request): AnonymousResourceCollection
    {
        return VendorOrderReportTrendResource::collection($this->service->getTrend($request->validated()))
            ->additional(['success' => true]);
    }
}
