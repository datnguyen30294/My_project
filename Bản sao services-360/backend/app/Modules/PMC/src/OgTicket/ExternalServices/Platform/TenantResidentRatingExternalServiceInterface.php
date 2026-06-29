<?php

declare(strict_types=1);

namespace App\Modules\PMC\OgTicket\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Pagination\LengthAwarePaginator;

interface TenantResidentRatingExternalServiceInterface
{
    /**
     * Đánh giá của cư dân trên các ticket trong tenant schema, kèm summary.
     * Summary tính trên tập đánh giá (đã lọc `project_id` nếu có) — KHÔNG áp
     * filter `rating`. Filter hỗ trợ: `rating`, `project_id`, `per_page`.
     *
     * @param  array<string, mixed>  $filters
     * @return array{summary: array{average: float|null, count: int}, paginator: LengthAwarePaginator}
     */
    public function getRatingsForTenant(Organization $tenant, array $filters): array;
}
