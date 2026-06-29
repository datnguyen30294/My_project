<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerProject\Contracts;

use App\Modules\Marketplace\PartnerProject\Models\PartnerProject;

interface ProjectVendorServiceInterface
{
    /**
     * Liệt kê vendor trên 1 dự án + cờ bật/tắt + số gói/số đơn (cross-DB).
     *
     * @return array{
     *     vendors: list<array{partner: \App\Modules\Marketplace\Partner\Models\Partner, enabled: bool, offer_count: int, order_count: int}>,
     *     stats: array{total: int, enabled_count: int},
     *     warnings: array{schema_missing: bool}
     * }
     */
    public function listForProject(string $tenantId, int $projectId): array;

    /**
     * Lật cờ tạm dừng vendor trên dự án. Trả null nếu vendor chưa gắn dự án.
     */
    public function toggle(
        int $partnerId,
        string $tenantId,
        int $projectId,
        bool $enabled,
        ?int $actorId = null,
    ): ?PartnerProject;
}
