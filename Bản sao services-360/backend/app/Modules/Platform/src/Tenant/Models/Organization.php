<?php

namespace App\Modules\Platform\Tenant\Models;

use App\Common\Models\BaseModel;
use App\Modules\Platform\Tenant\Enums\ServicePlan;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant;

class Organization extends Tenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains, HasFactory, SoftDeletes;

    protected $table = 'tenants';

    /**
     * Tenant id is the org code (string primary key).
     * Override GeneratesIds trait which dynamically returns true
     * when no UniqueIdentifierGenerator is bound.
     */
    public function getIncrementing(): bool
    {
        return false;
    }

    public function getKeyType(): string
    {
        return 'string';
    }

    /**
     * Columns that have dedicated DB columns (not stored in `data` JSON).
     *
     * @return list<string>
     */
    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
            'is_organization',
            'is_active',
            'is_vendor_enabled',
            'tax_code',
            'representative_name',
            'contact_email',
            'contact_phone',
            'address',
            'service_plan',
            'notes',
        ];
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_organization' => 'boolean',
            'is_vendor_enabled' => 'boolean',
            'service_plan' => ServicePlan::class,
        ];
    }

    /**
     * @return HasOne<TenantConfig, $this>
     */
    public function config(): HasOne
    {
        return $this->hasOne(TenantConfig::class, 'tenant_id');
    }

    /**
     * Schema name follows the Stancl convention (prefix + tenant id + suffix).
     */
    public function schemaName(): string
    {
        return config('tenancy.database.prefix').$this->getTenantKey().config('tenancy.database.suffix');
    }

    /**
     * Return the appropriate LIKE operator for the current database driver.
     */
    public static function likeOperator(): string
    {
        return BaseModel::likeOperator();
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeOrganization(Builder $query): Builder
    {
        return $query->where('is_organization', true);
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeSearch(Builder $query, string $keyword): Builder
    {
        return $query->where(function (Builder $q) use ($keyword): void {
            $q->where('name', static::likeOperator(), "%{$keyword}%")
                ->orWhere('id', static::likeOperator(), "%{$keyword}%")
                ->orWhere('tax_code', static::likeOperator(), "%{$keyword}%")
                ->orWhere('contact_email', static::likeOperator(), "%{$keyword}%")
                ->orWhere('representative_name', static::likeOperator(), "%{$keyword}%");
        });
    }

    protected static function newFactory(): \Database\Factories\Platform\OrganizationFactory
    {
        return \Database\Factories\Platform\OrganizationFactory::new();
    }
}
