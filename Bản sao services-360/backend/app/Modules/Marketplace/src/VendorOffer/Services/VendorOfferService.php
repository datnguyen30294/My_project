<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOffer\Services;

use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\Partner\Repositories\PartnerRepository;
use App\Modules\Marketplace\VendorOffer\Contracts\VendorOfferServiceInterface;
use App\Modules\Marketplace\VendorOffer\Models\VendorOffer;
use App\Modules\Marketplace\VendorOffer\Repositories\VendorOfferRepository;
use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use App\Modules\Platform\Tenant\ExternalServices\Marketplace\OrganizationLookupExternalServiceInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class VendorOfferService implements VendorOfferServiceInterface
{
    public function __construct(
        protected PartnerRepository $partnerRepository,
        protected VendorOfferRepository $offerRepository,
        protected OrganizationLookupExternalServiceInterface $orgLookup,
    ) {}

    public function listForPartner(int $partnerId, array $filters): array
    {
        $partner = $this->resolvePartner($partnerId);

        if ($partner->tenant_id === null) {
            return $this->emptyResult($filters);
        }

        try {
            if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
                return $this->emptyResult($filters, schemaMissing: true);
            }

            $paginator = ResiMartConnection::runInTenantSchema(
                $partner->tenant_id,
                fn (): LengthAwarePaginator => $this->offerRepository->listForPartner($filters),
            );

            $this->attachListingNames($paginator->getCollection());

            return [
                'data' => $paginator,
                'warnings' => ['schema_missing' => false],
            ];
        } catch (Throwable $e) {
            report($e);

            return $this->emptyResult($filters, schemaMissing: true);
        }
    }

    public function countForPartner(int $partnerId): int
    {
        $partner = $this->partnerRepository->findByIdOrNull($partnerId);

        if ($partner === null || $partner->tenant_id === null) {
            return 0;
        }

        try {
            if (! ResiMartConnection::schemaExists($partner->tenant_id)) {
                return 0;
            }

            return ResiMartConnection::runInTenantSchema(
                $partner->tenant_id,
                fn (): int => $this->offerRepository->countForPartner(),
            );
        } catch (Throwable $e) {
            report($e);

            return 0;
        }
    }

    private function resolvePartner(int $partnerId): Partner
    {
        $partner = $this->partnerRepository->findByIdOrNull($partnerId);

        if ($partner === null) {
            throw new BusinessException(
                message: 'Vendor không tồn tại.',
                errorCode: 'VENDOR_NOT_FOUND',
                httpStatusCode: Response::HTTP_NOT_FOUND,
            );
        }

        return $partner;
    }

    /**
     * Resolve the PMC operating-company (tenant) name and project name for each
     * flattened offer row from the `link_tenant_id` / `link_project_id` carried
     * by the pivot. Runs against the PMC central DB via {@see $orgLookup} — MUST
     * be called after exiting the resi_mart schema search_path.
     *
     * @param  Collection<int, VendorOffer>  $offers
     */
    private function attachListingNames(Collection $offers): void
    {
        if ($offers->isEmpty()) {
            return;
        }

        $tenantIds = $offers
            ->pluck('link_tenant_id')
            ->filter(fn ($v): bool => $v !== null && $v !== '')
            ->map(fn ($v): string => (string) $v)
            ->unique()
            ->values()
            ->all();

        $tenantNames = $tenantIds === [] ? [] : $this->orgLookup->getTenantNames($tenantIds);

        $projectNames = [];

        foreach ($offers->groupBy('link_tenant_id') as $tenantId => $group) {
            if ($tenantId === null || $tenantId === '') {
                continue;
            }

            $projectIds = $group
                ->pluck('link_project_id')
                ->filter(fn ($v): bool => $v !== null)
                ->map(fn ($v): int => (int) $v)
                ->unique()
                ->values()
                ->all();

            $projectNames[(string) $tenantId] = $projectIds === []
                ? []
                : $this->orgLookup->getProjectNamesForTenant((string) $tenantId, $projectIds);
        }

        $offers->each(function (VendorOffer $offer) use ($tenantNames, $projectNames): void {
            $tenantId = $offer->getAttribute('link_tenant_id');
            $projectId = $offer->getAttribute('link_project_id');

            $tenantKey = $tenantId === null || $tenantId === '' ? null : (string) $tenantId;
            $projectKey = $projectId === null ? null : (int) $projectId;

            $offer->setAttribute('tenant_name', $tenantKey === null ? null : ($tenantNames[$tenantKey] ?? null));
            $offer->setAttribute(
                'project_name',
                $tenantKey !== null && $projectKey !== null
                    ? ($projectNames[$tenantKey][$projectKey] ?? null)
                    : null,
            );
        });
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{data: LengthAwarePaginator, warnings: array{schema_missing: bool}}
     */
    private function emptyResult(array $filters, bool $schemaMissing = false): array
    {
        $perPage = min((int) ($filters['per_page'] ?? 20), 50);

        return [
            'data' => new Paginator([], 0, $perPage, (int) ($filters['page'] ?? 1)),
            'warnings' => ['schema_missing' => $schemaMissing],
        ];
    }
}
