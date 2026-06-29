<?php

namespace App\Modules\Platform\Tenant\Models;

use App\Common\Models\BaseModel;
use App\Modules\Platform\Tenant\Enums\SubscriptionCycle;
use App\Modules\Platform\Tenant\Enums\TenantFeeMode;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TenantConfig extends BaseModel
{
    /** @var list<string> */
    protected $fillable = [
        'tenant_id',
        'max_projects',
        'max_accounts',
        'session_timeout_minutes',
        'resident_portal_enabled',
        'partner_portal_enabled',
        'fee_mode',
        'subscription_cycle',
        'subscription_amount',
        'fixed_fee_per_order',
        'percent_fee_per_order',
        'enabled_modules',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /**
     * Force the central connection — `tenant_configs` lives in the central DB,
     * not in tenant schemas.
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
            'max_projects' => 'integer',
            'max_accounts' => 'integer',
            'session_timeout_minutes' => 'integer',
            'resident_portal_enabled' => 'boolean',
            'partner_portal_enabled' => 'boolean',
            'fee_mode' => TenantFeeMode::class,
            'subscription_cycle' => SubscriptionCycle::class,
            'subscription_amount' => 'decimal:2',
            'fixed_fee_per_order' => 'decimal:2',
            'percent_fee_per_order' => 'decimal:2',
            'enabled_modules' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Organization, $this>
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'tenant_id');
    }

    /**
     * Default attribute values for a freshly provisioned tenant.
     *
     * @return array<string, mixed>
     */
    public static function defaults(): array
    {
        return [
            'max_projects' => 10,
            'max_accounts' => 50,
            'session_timeout_minutes' => 480,
            'resident_portal_enabled' => true,
            'partner_portal_enabled' => true,
            'fee_mode' => TenantFeeMode::None,
            'subscription_cycle' => SubscriptionCycle::Monthly,
            'subscription_amount' => 0,
            'fixed_fee_per_order' => 0,
            'percent_fee_per_order' => 0,
            'enabled_modules' => null,
        ];
    }

    protected static function newFactory(): \Database\Factories\Platform\TenantConfigFactory
    {
        return \Database\Factories\Platform\TenantConfigFactory::new();
    }
}
