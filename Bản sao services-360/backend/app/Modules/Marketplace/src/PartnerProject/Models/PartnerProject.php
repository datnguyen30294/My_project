<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerProject\Models;

use App\Common\Models\BaseModel;

/**
 * Central-scoped pivot — lives in `public.partner_project`.
 *
 * Links a marketplace partner (central) to a specific (PMC tenant, project)
 * pair. resi_mart reads this table directly via its `pmc_central` connection
 * to know which (tenant, project) destinations a vendor's products can ship
 * to.
 *
 * No Eloquent relationship is exposed to `Project` here because projects live
 * inside each tenant DB — fetching them cross-DB is the responsibility of the
 * service layer.
 */
class PartnerProject extends BaseModel
{
    protected $table = 'partner_project';

    /**
     * Match Partner's connection logic: use `central` in production, fall
     * back to default in tests so RefreshDatabase finds the table.
     */
    public function getConnectionName(): ?string
    {
        return app()->runningUnitTests() ? null : 'central';
    }

    protected $fillable = [
        'partner_id',
        'tenant_id',
        'project_id',
        'is_vendor_enabled',
        'registered_at',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'partner_id' => 'integer',
            'project_id' => 'integer',
            'is_vendor_enabled' => 'boolean',
            'registered_at' => 'datetime',
        ];
    }
}
