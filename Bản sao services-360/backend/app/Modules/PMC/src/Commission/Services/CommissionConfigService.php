<?php

namespace App\Modules\PMC\Commission\Services;

use App\Common\Services\BaseService;
use App\Modules\Platform\Tenant\ExternalServices\PMC\TenantConfigExternalServiceInterface;
use App\Modules\PMC\Commission\Contracts\CommissionConfigServiceInterface;
use App\Modules\PMC\Commission\Models\CommissionPartyRule;
use App\Modules\PMC\Commission\Models\ProjectCommissionConfig;
use App\Modules\PMC\Commission\Repositories\CommissionConfigRepository;
use App\Modules\PMC\Project\Models\Project;
use App\Modules\PMC\Project\Repositories\ProjectRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CommissionConfigService extends BaseService implements CommissionConfigServiceInterface
{
    public function __construct(
        protected CommissionConfigRepository $repository,
        protected ProjectRepository $projectRepository,
        protected TenantConfigExternalServiceInterface $tenantConfig,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     */
    public function listProjects(array $filters): LengthAwarePaginator
    {
        return $this->repository->listProjects($filters);
    }

    /**
     * @return array{project: Project, config: ProjectCommissionConfig|null, adjusters: Collection, platform: array{percent: float, value_fixed: float, source: string}}
     */
    public function getConfigDetail(int $projectId): array
    {
        $project = $this->projectRepository->findById($projectId);
        $config = $this->repository->findByProject($projectId);
        $adjusters = $this->repository->getAdjusters($projectId);

        return [
            'project' => $project,
            'config' => $config,
            'adjusters' => $adjusters,
            'platform' => $this->resolvePlatformConfig($projectId),
        ];
    }

    /**
     * Phần "Platform" trong phân bổ hoa hồng = phí nền tảng áp dụng cho dự án
     * (override theo dự án nếu có, nếu không thì mặc định tenant — đọc qua
     * ExternalService). Platform luôn bị trừ đầu tiên. Không có tenant context /
     * tenant chưa cấu hình phí → 0/0.
     *
     * @return array{percent: float, value_fixed: float, source: string}
     */
    private function resolvePlatformConfig(int $projectId): array
    {
        $feePolicy = $this->tenantConfig->getFeePolicyForProject($projectId);

        if ($feePolicy !== null) {
            return [
                'percent' => $feePolicy->appliedPercent(),
                'value_fixed' => $feePolicy->appliedFixed(),
                'source' => 'api',
            ];
        }

        return [
            'percent' => 0.0,
            'value_fixed' => 0.0,
            'source' => 'fallback',
        ];
    }

    public function getConfigByProject(int $projectId): ?ProjectCommissionConfig
    {
        return $this->repository->findByProject($projectId);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function saveConfig(int $projectId, array $data): ProjectCommissionConfig
    {
        return $this->executeInTransaction(function () use ($projectId, $data): ProjectCommissionConfig {
            $config = $this->repository->upsertConfig($projectId);

            // Replace party rules
            $this->repository->deletePartyRules($config->id);

            foreach ($data['party_rules'] as $partyRuleData) {
                $this->repository->createPartyRule([
                    'config_id' => $config->id,
                    'party_type' => $partyRuleData['party_type'],
                    'value_type' => $partyRuleData['value_type'],
                    'percent' => $partyRuleData['percent'] ?? null,
                    'value_fixed' => $partyRuleData['value_fixed'] ?? null,
                ]);
            }

            // Replace dept rules (cascade deletes staff rules via FK)
            $this->repository->deleteDeptRules($config->id);

            foreach ($data['dept_rules'] ?? [] as $deptRuleData) {
                $deptRule = $this->repository->createDeptRule([
                    'config_id' => $config->id,
                    'department_id' => $deptRuleData['department_id'],
                    'sort_order' => $deptRuleData['sort_order'],
                    'value_type' => $deptRuleData['value_type'],
                    'percent' => $deptRuleData['percent'] ?? null,
                    'value_fixed' => $deptRuleData['value_fixed'] ?? null,
                ]);

                foreach ($deptRuleData['staff_rules'] as $staffRuleData) {
                    $this->repository->createStaffRule([
                        'dept_rule_id' => $deptRule->id,
                        'account_id' => $staffRuleData['account_id'],
                        'sort_order' => $staffRuleData['sort_order'],
                        'value_type' => $staffRuleData['value_type'],
                        'percent' => $staffRuleData['percent'] ?? null,
                        'value_fixed' => $staffRuleData['value_fixed'] ?? null,
                    ]);
                }
            }

            return $this->repository->findByProject($projectId);
        });
    }

    /**
     * Chia lại tỷ lệ % của các bên (CTVH, Ban quản trị, Ban quản lý) khi phần
     * "Platform" (phí nền tảng) thay đổi, GIỮ NGUYÊN tỷ lệ tương đối giữa các
     * bên. Tổng % các bên co/giãn để vừa khít phần còn lại = 100 − platform%.
     * Sai số làm tròn (decimal 5,2) được dồn vào bên có tỷ lệ lớn nhất.
     *
     * No-op (trả false) khi dự án chưa có cấu hình hoa hồng, hoặc không bên nào
     * dùng % (không có cơ sở để chia theo tỷ lệ).
     */
    public function rebalancePartyRulesToPlatformPercent(int $projectId, float $newPlatformPercent): bool
    {
        $config = $this->repository->findByProject($projectId);

        if ($config === null) {
            return false;
        }

        $percentRules = $config->partyRulesOrdered
            ->filter(fn (CommissionPartyRule $rule): bool => $rule->value_type->requiresPercent());

        $currentSum = (float) $percentRules->sum(fn (CommissionPartyRule $rule): float => (float) $rule->percent);

        if ($percentRules->isEmpty() || $currentSum <= 0.0) {
            return false;
        }

        $remaining = max(0.0, round(100 - $newPlatformPercent, 2));

        $newPercents = [];
        foreach ($percentRules as $rule) {
            $newPercents[$rule->id] = round((float) $rule->percent * $remaining / $currentSum, 2);
        }

        $diff = round($remaining - array_sum($newPercents), 2);
        if (abs($diff) >= 0.01) {
            $largestId = (int) array_search(max($newPercents), $newPercents, true);
            $newPercents[$largestId] = round($newPercents[$largestId] + $diff, 2);
        }

        $this->executeInTransaction(function () use ($newPercents): void {
            $this->repository->updatePartyRulePercents($newPercents);
        });

        return true;
    }

    public function getAdjusters(int $projectId): Collection
    {
        return $this->repository->getAdjusters($projectId);
    }

    /**
     * @param  array<int>  $accountIds
     */
    public function saveAdjusters(int $projectId, array $accountIds): Collection
    {
        return $this->executeInTransaction(function () use ($projectId, $accountIds): Collection {
            return $this->repository->syncAdjusters($projectId, $accountIds);
        });
    }

    public function getAvailableDepartments(int $projectId): Collection
    {
        $this->projectRepository->findById($projectId);

        return $this->repository->getAvailableDepartments($projectId);
    }
}
