<?php

declare(strict_types=1);

namespace App\Modules\Platform\Tenant\ExternalServices\PMC;

/**
 * Snapshot giới hạn tài nguyên + cấu hình dịch vụ của tenant hiện tại
 * (đọc từ tenant_configs central).
 */
final readonly class TenantPlanLimits
{
    /**
     * @param  list<string>|null  $enabledModules  null = bật tất cả module (tenant chưa cấu hình)
     */
    public function __construct(
        public int $maxProjects,
        public int $maxAccounts,
        public int $sessionTimeoutMinutes,
        public bool $residentPortalEnabled,
        public bool $partnerPortalEnabled,
        public ?array $enabledModules,
    ) {}

    public function isModuleEnabled(string $module): bool
    {
        return $this->enabledModules === null || in_array($module, $this->enabledModules, true);
    }
}
