<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Models;

use App\Common\Models\BaseModel;
use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use Illuminate\Database\Eloquent\Builder;

/**
 * Central-scoped — lives in `public.partners`. Master marketplace partner list.
 *
 * resi_mart reads this table via its `pmc_central` Postgres connection
 * (read-only). Do NOT add tenant-scoped relationships here.
 */
class Partner extends BaseModel
{
    protected $table = 'partners';

    /**
     * Use the explicit `central` connection in production (so resi_mart sees
     * the same shape regardless of which side queries it). In tests the
     * `central` SQLite ':memory:' DB is a separate instance from the default
     * sqlite — fall back to default so RefreshDatabase-migrated tables are
     * found.
     */
    public function getConnectionName(): ?string
    {
        return app()->runningUnitTests() ? null : 'central';
    }

    protected $fillable = [
        'slug',
        'tenant_id',
        'owner_tenant_id',
        'name',
        'display_name',
        'status',
        'custom_domain',
        'categories',
        'owner_email',
        'owner_phone',
        'logo_url',
        'description',
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
            'categories' => 'array',
            'status' => PartnerStatus::class,
        ];
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
            $q->where('name', $like, $term)
                ->orWhere('display_name', $like, $term)
                ->orWhere('slug', $like, $term)
                ->orWhere('owner_email', $like, $term);
        });
    }
}
