<?php

namespace App\Modules\Platform\Tenant\Models;

use App\Common\Models\BaseModel;
use App\Modules\Platform\Tenant\Enums\SubscriptionCycle;
use App\Modules\Platform\Tenant\Enums\TenantFeeMode;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Per-project override of the platform fee + operational flags. Keyed by the
 * pair (organization_id, project_id) — a project only exists inside its
 * tenant's schema, so there is no cross-schema FK on `project_id`.
 */
class ProjectFeeConfig extends BaseModel
{
    /** @var list<string> */
    protected $fillable = [
        'organization_id',
        'project_id',
        'inherit_default',
        'fee_mode',
        'fixed_fee_per_order',
        'percent_fee_per_order',
        'subscription_amount',
        'subscription_cycle',
        'platform_service_enabled',
        'notes',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /**
     * Force the central connection — `project_fee_configs` lives in the central
     * DB, not in tenant schemas.
     */
    public function getConnectionName(): ?string
    {
        return config('tenancy.database.central_connection');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'project_id' => 'integer',
            'inherit_default' => 'boolean',
            'fee_mode' => TenantFeeMode::class,
            'fixed_fee_per_order' => 'decimal:2',
            'percent_fee_per_order' => 'decimal:2',
            'subscription_amount' => 'decimal:2',
            'subscription_cycle' => SubscriptionCycle::class,
            'platform_service_enabled' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Organization, $this>
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    protected static function newFactory(): \Database\Factories\Platform\ProjectFeeConfigFactory
    {
        return \Database\Factories\Platform\ProjectFeeConfigFactory::new();
    }
}
