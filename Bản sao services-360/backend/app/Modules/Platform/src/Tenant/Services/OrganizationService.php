<?php

namespace App\Modules\Platform\Tenant\Services;

use App\Common\Exceptions\BusinessException;
use App\Common\Services\BaseService;
use App\Modules\Platform\Tenant\Contracts\OrganizationServiceInterface;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Tenant\Models\TenantConfig;
use App\Modules\Platform\Tenant\Repositories\OrganizationRepository;
use App\Modules\Platform\Tenant\Repositories\TenantConfigRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;

class OrganizationService extends BaseService implements OrganizationServiceInterface
{
    protected const PROFILE_FIELDS = [
        'tax_code',
        'representative_name',
        'contact_email',
        'contact_phone',
        'address',
        'service_plan',
        'notes',
    ];

    public function __construct(
        protected OrganizationRepository $repository,
        protected TenantConfigRepository $configRepository,
    ) {}

    public function list(array $filters): LengthAwarePaginator
    {
        return $this->repository->list($filters);
    }

    public function findById(string $id): Organization
    {
        /** @var Organization $organization */
        $organization = $this->repository->findById($id, ['*'], ['domains']);

        $this->configRepository->findOrCreateForTenant($organization->getTenantKey());
        $organization->load('config');

        return $organization;
    }

    public function create(array $data): Organization
    {
        return $this->executeInTransaction(function () use ($data): Organization {
            $domains = (array) ($data['domains'] ?? []);
            unset($data['domains']);

            /** @var Organization $organization */
            $organization = $this->repository->create(array_merge(
                [
                    'id' => $data['id'],
                    'name' => $data['name'],
                    'is_organization' => $data['is_organization'] ?? false,
                    'is_active' => $data['is_active'] ?? true,
                ],
                Arr::only($data, self::PROFILE_FIELDS),
            ));

            if ($domains === []) {
                $domains = [$this->defaultDomain($organization->getTenantKey())];
            }

            $this->syncDomains($organization, $domains);

            $this->configRepository->create(array_merge(
                ['tenant_id' => $organization->getTenantKey()],
                TenantConfig::defaults(),
            ));

            return $organization->fresh(['domains', 'config']) ?? $organization;
        });
    }

    public function update(string $id, array $data): Organization
    {
        return $this->executeInTransaction(function () use ($id, $data): Organization {
            $organization = $this->findById($id);

            $domains = array_key_exists('domains', $data) ? (array) $data['domains'] : null;
            unset($data['domains'], $data['id']);

            if ($data !== []) {
                $organization->update($data);
            }

            if ($domains !== null) {
                $this->syncDomains($organization, $domains);
            }

            return $organization->fresh(['domains', 'config']) ?? $organization;
        });
    }

    public function delete(string $id): void
    {
        $this->executeInTransaction(function () use ($id): void {
            /** @var Organization $organization */
            $organization = $this->repository->findById($id);

            if ($organization->is_active) {
                throw new BusinessException('Không thể xoá tenant đang hoạt động. Vui lòng vô hiệu hoá tenant trước khi xoá.');
            }

            $this->configRepository->deleteByTenantId($organization->getTenantKey());

            $organization->delete();
        });
    }

    public function toggleVendorFeature(string $id, bool $enabled): Organization
    {
        $organization = $this->findById($id);

        $organization->update(['is_vendor_enabled' => $enabled]);

        return $organization->fresh(['domains', 'config']) ?? $organization;
    }

    public function toggleActive(string $id, bool $isActive): Organization
    {
        $organization = $this->findById($id);

        $organization->update(['is_active' => $isActive]);

        return $organization->fresh(['domains', 'config']) ?? $organization;
    }

    public function updateConfig(string $id, array $data): Organization
    {
        return $this->executeInTransaction(function () use ($id, $data): Organization {
            $organization = $this->findById($id);

            $config = $this->configRepository->findOrCreateForTenant($organization->getTenantKey());
            $config->update($data);

            return $organization->fresh(['domains', 'config']) ?? $organization;
        });
    }

    public function stats(): array
    {
        return $this->repository->stats();
    }

    /**
     * Default domain generated from the tenant code and the first central domain.
     */
    protected function defaultDomain(string $tenantId): string
    {
        /** @var list<string> $centralDomains */
        $centralDomains = (array) config('tenancy.central_domains', []);

        $base = $centralDomains[0] ?? 'localhost';

        return strtolower($tenantId.'.'.$base);
    }

    /**
     * @param  list<string>  $domains
     */
    protected function syncDomains(Organization $organization, array $domains): void
    {
        $domains = array_values(array_unique(array_filter(array_map('strtolower', $domains))));

        $existing = $organization->domains()->pluck('domain')->all();

        $toAdd = array_diff($domains, $existing);
        $toRemove = array_diff($existing, $domains);

        if ($toRemove !== []) {
            $organization->domains()->whereIn('domain', $toRemove)->delete();
        }

        foreach ($toAdd as $domain) {
            $organization->domains()->create(['domain' => $domain]);
        }
    }
}
