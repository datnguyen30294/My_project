<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Models;

use App\Common\Models\BaseModel;
use App\Modules\Marketplace\Partner\Models\Partner;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\PartnerCommissionContract\Models\PartnerCommissionContract;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Central-scoped — hoa hồng gán thủ công cho 1 đơn vendor (resi_mart) đã hoàn
 * thành nhưng không khớp hợp đồng per_order. `terms` = {fixed, percent} dùng
 * lại {@see \App\Modules\Marketplace\VendorOrder\Services\VendorOrderCommissionCalculator}.
 *
 * @property int $id
 * @property int $partner_id
 * @property int $vendor_order_id
 * @property string|null $tenant_id
 * @property int|null $project_id
 * @property RevenueRecipient $revenue_recipient
 * @property array<string, mixed> $terms
 * @property int|null $source_contract_id
 * @property string|null $note
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 */
class VendorOrderCommissionOverride extends BaseModel
{
    protected $table = 'vendor_order_commission_overrides';

    /**
     * Explicit `central` connection in production; default in-memory SQLite in
     * tests (mirrors Partner / PartnerCommissionContract).
     */
    public function getConnectionName(): ?string
    {
        return app()->runningUnitTests() ? null : 'central';
    }

    protected $fillable = [
        'partner_id',
        'vendor_order_id',
        'tenant_id',
        'project_id',
        'revenue_recipient',
        'terms',
        'source_contract_id',
        'note',
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
            'vendor_order_id' => 'integer',
            'project_id' => 'integer',
            'source_contract_id' => 'integer',
            'terms' => 'array',
            'revenue_recipient' => RevenueRecipient::class,
        ];
    }

    protected static function newFactory(): \Database\Factories\Platform\VendorOrderCommissionOverrideFactory
    {
        return \Database\Factories\Platform\VendorOrderCommissionOverrideFactory::new();
    }

    /**
     * @return BelongsTo<Partner, self>
     */
    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class, 'partner_id');
    }

    /**
     * @return BelongsTo<PartnerCommissionContract, self>
     */
    public function sourceContract(): BelongsTo
    {
        return $this->belongsTo(PartnerCommissionContract::class, 'source_contract_id');
    }
}
