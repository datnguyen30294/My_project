<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Models;

use App\Common\Models\BaseModel;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\CommissionMode;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractCreatedScope;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Central-scoped — lives in `public.partner_commission_contracts`.
 *
 * Once a contract leaves `draft`, its financial terms (mode, terms jsonb)
 * are immutable. State transitions go through the Service layer.
 *
 * @property int $id
 * @property string $contract_code
 * @property int $partner_id
 * @property string $tenant_id
 * @property int $project_id
 * @property CommissionMode $commission_mode
 * @property array<string, mixed> $terms
 * @property RevenueRecipient $revenue_recipient
 * @property ContractStatus $status
 * @property \Illuminate\Support\Carbon|null $starts_at
 * @property \Illuminate\Support\Carbon|null $ends_at
 * @property \Illuminate\Support\Carbon|null $activated_at
 * @property \Illuminate\Support\Carbon|null $replaced_at
 * @property int|null $replaced_by_contract_id
 * @property \Illuminate\Support\Carbon|null $cancelled_at
 * @property int|null $cancelled_by
 * @property string|null $cancellation_reason
 * @property \Illuminate\Support\Carbon|null $signed_at
 * @property int|null $signed_by
 * @property string|null $notes
 * @property ContractCreatedScope $created_scope
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 */
class PartnerCommissionContract extends BaseModel
{
    protected $table = 'partner_commission_contracts';

    /**
     * Use the explicit `central` connection in production. In tests fall back
     * to the default in-memory SQLite so RefreshDatabase-migrated tables are
     * found (mirrors Partner model behaviour).
     */
    public function getConnectionName(): ?string
    {
        return app()->runningUnitTests() ? null : 'central';
    }

    protected $fillable = [
        'contract_code',
        'partner_id',
        'tenant_id',
        'project_id',
        'commission_mode',
        'terms',
        'revenue_recipient',
        'status',
        'starts_at',
        'ends_at',
        'activated_at',
        'replaced_at',
        'replaced_by_contract_id',
        'cancelled_at',
        'cancelled_by',
        'cancellation_reason',
        'signed_at',
        'signed_by',
        'notes',
        'created_scope',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected static function newFactory(): \Database\Factories\Platform\PartnerCommissionContractFactory
    {
        return \Database\Factories\Platform\PartnerCommissionContractFactory::new();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'terms' => 'array',
            'commission_mode' => CommissionMode::class,
            'revenue_recipient' => RevenueRecipient::class,
            'status' => ContractStatus::class,
            'created_scope' => ContractCreatedScope::class,
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'activated_at' => 'datetime',
            'replaced_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'signed_at' => 'datetime',
        ];
    }

    /**
     * Lazy expiry — compute the effective status without persisting it.
     * Terminal states are returned as-is.
     */
    public function getCurrentStatus(): ContractStatus
    {
        if ($this->status->isTerminal()) {
            return $this->status;
        }

        if ($this->ends_at !== null && now()->gt($this->ends_at)) {
            return ContractStatus::Expired;
        }

        return $this->status;
    }

    /**
     * @return BelongsTo<Partner, self>
     */
    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class, 'partner_id');
    }

    /**
     * @return BelongsTo<self, self>
     */
    public function replacedBy(): BelongsTo
    {
        return $this->belongsTo(self::class, 'replaced_by_contract_id');
    }

    /**
     * @return HasMany<self>
     */
    public function replaces(): HasMany
    {
        return $this->hasMany(self::class, 'replaced_by_contract_id');
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeForScope(Builder $query, int $partnerId, string $tenantId, int $projectId): Builder
    {
        return $query
            ->where('partner_id', $partnerId)
            ->where('tenant_id', $tenantId)
            ->where('project_id', $projectId);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        $like = self::likeOperator();
        $term = '%'.trim($term).'%';

        return $query->where(function (Builder $q) use ($like, $term): void {
            $q->where('contract_code', $like, $term)
                ->orWhere('notes', $like, $term);
        });
    }
}
