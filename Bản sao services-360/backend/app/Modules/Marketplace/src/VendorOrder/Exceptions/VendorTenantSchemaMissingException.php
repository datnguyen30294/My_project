<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Exceptions;

use RuntimeException;

class VendorTenantSchemaMissingException extends RuntimeException
{
    public function __construct(public readonly string $tenantId)
    {
        parent::__construct(sprintf('Vendor tenant schema "tenant_%s" does not exist in resi_mart database.', $tenantId));
    }
}
