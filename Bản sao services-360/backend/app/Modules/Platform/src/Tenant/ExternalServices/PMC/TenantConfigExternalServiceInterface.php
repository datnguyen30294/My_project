<?php

declare(strict_types=1);

namespace App\Modules\Platform\Tenant\ExternalServices\PMC;

/**
 * Bridge để PMC module đọc giới hạn tài nguyên (tenant_configs) của tenant
 * hiện tại mà không import trực tiếp TenantConfig model.
 */
interface TenantConfigExternalServiceInterface
{
    /**
     * Giới hạn của tenant đang khởi tạo. Trả null khi không có tenant context
     * (central / tests) hoặc tenant chưa có bản ghi config → không áp giới hạn.
     */
    public function getLimitsForCurrentTenant(): ?TenantPlanLimits;

    /**
     * Chính sách phí nền tảng của tenant hiện tại. Trả null khi không có tenant
     * context hoặc tenant chưa có config → coi như không thu phí (0).
     */
    public function getFeePolicyForCurrentTenant(): ?TenantFeePolicy;

    /**
     * Chính sách phí hiệu lực cho 1 dự án của tenant hiện tại: dùng override của
     * dự án (`project_fee_configs` với `inherit_default = false`) nếu có; ngược
     * lại = mặc định tenant (`getFeePolicyForCurrentTenant`).
     */
    public function getFeePolicyForProject(int $projectId): ?TenantFeePolicy;
}
