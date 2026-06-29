<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\ExternalServices;

use RuntimeException;
use Throwable;

class ResiMartProvisioningException extends RuntimeException
{
    /**
     * @param  array<string, mixed>  $context
     */
    public function __construct(
        string $message,
        public readonly array $context = [],
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }
}
