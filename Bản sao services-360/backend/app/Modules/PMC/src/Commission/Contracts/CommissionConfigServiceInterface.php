<?php

namespace App\Modules\PMC\Commission\Contracts;

use App\Modules\PMC\Commission\Models\ProjectCommissionConfig;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface CommissionConfigServiceInterface
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function listProjects(array $filters): LengthAwarePaginator;

    /**
     * @return array{project: \App\Modules\PMC\Project\Models\Project, config: ProjectCommissionConfig|null, adjusters: Collection, platform: array{percent: float, value_fixed: float, source: string}}
     */
    public function getConfigDetail(int $projectId): array;

    public function getConfigByProject(int $projectId): ?ProjectCommissionConfig;

    /**
     * @param  array<string, mixed>  $data
     */
    public function saveConfig(int $projectId, array $data): ProjectCommissionConfig;

    /**
     * Chia lại tỷ lệ % các bên hoa hồng khi phí nền tảng thay đổi, giữ nguyên tỷ
     * lệ tương đối. Trả về true nếu có chia lại, false nếu no-op.
     */
    public function rebalancePartyRulesToPlatformPercent(int $projectId, float $newPlatformPercent): bool;

    public function getAdjusters(int $projectId): Collection;

    /**
     * @param  array<int>  $accountIds
     */
    public function saveAdjusters(int $projectId, array $accountIds): Collection;

    public function getAvailableDepartments(int $projectId): Collection;
}
