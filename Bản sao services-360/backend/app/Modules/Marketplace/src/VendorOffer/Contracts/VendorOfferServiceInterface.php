<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOffer\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface VendorOfferServiceInterface
{
    /**
     * List a vendor's offers (resi_mart products), read cross-DB. Degrades to
     * an empty paginator + `schema_missing` warning when the vendor's
     * resi_mart schema is unavailable.
     *
     * @param  array<string, mixed>  $filters
     * @return array{data: LengthAwarePaginator, warnings: array{schema_missing: bool}}
     */
    public function listForPartner(int $partnerId, array $filters): array;

    /**
     * Total offer count for a vendor (degrades to 0 when unreachable).
     */
    public function countForPartner(int $partnerId): int;
}
