<?php

declare(strict_types=1);

namespace App\Modules\PMC\Commission\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;

/**
 * Bridge để Platform module chia lại tỷ lệ % các bên trong cấu hình hoa hồng
 * (schema tenant) khi phí nền tảng của một dự án thay đổi — mà không import trực
 * tiếp service/model của PMC Commission.
 */
interface CommissionRebalanceExternalServiceInterface
{
    /**
     * Chạy trong schema của `$tenant`: giữ nguyên tỷ lệ tương đối giữa các bên,
     * co/giãn % để tổng vừa khít phần còn lại sau phí nền tảng mới. No-op nếu dự
     * án chưa cấu hình hoa hồng hoặc không bên nào dùng %.
     */
    public function rebalancePartyRulesForPlatformPercent(Organization $tenant, int $projectId, float $newPlatformPercent): void;
}
