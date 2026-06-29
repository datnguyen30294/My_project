<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\ExternalServices;

/**
 * Value object returned by resi_mart after successful provisioning.
 */
final readonly class ProvisionedVendor
{
    /**
     * @param  list<string>  $domains
     */
    public function __construct(
        public string $tenantId,
        public string $slug,
        public string $status,
        public array $domains,
        public ?string $provisionedAt,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        /** @var list<string> $domains */
        $domains = array_values(array_map(
            static fn ($d): string => (string) $d,
            (array) ($data['domains'] ?? []),
        ));

        return new self(
            tenantId: (string) ($data['tenant_id'] ?? ''),
            slug: (string) ($data['slug'] ?? ''),
            status: (string) ($data['status'] ?? 'unknown'),
            domains: $domains,
            provisionedAt: isset($data['provisioned_at']) ? (string) $data['provisioned_at'] : null,
        );
    }
}
