<?php

namespace App\Modules\PMC\Account\Resources;

use App\Common\Resources\BaseResource;
use App\Modules\Platform\Tenant\Enums\TenantModule;
use App\Modules\Platform\Tenant\ExternalServices\PMC\TenantConfigExternalServiceInterface;
use App\Modules\PMC\Account\Models\Account;
use Illuminate\Http\Request;

/**
 * @mixin Account
 */
class AuthResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        $tenant = function_exists('tenant') ? tenant() : null;

        return [
            /** @var int */
            'id' => $this->id,
            /** @var string */
            'name' => $this->name,
            /** @var string */
            'email' => $this->email,
            /** @var string|null */
            'avatar_url' => $this->avatar_url,
            /** @var list<string> */
            'permissions' => $this->getPermissionNames(),
            /** @var array{id: string|null, is_vendor_enabled: bool, enabled_modules: list<string>}|null */
            'tenant' => $tenant === null ? null : [
                'id' => (string) $tenant->getKey(),
                'is_vendor_enabled' => (bool) ($tenant->is_vendor_enabled ?? false),
                'enabled_modules' => $this->resolveEnabledModules(),
            ],
        ];
    }

    /**
     * Danh sách module đang bật cho tenant — chưa cấu hình thì bật tất cả.
     *
     * @return list<string>
     */
    protected function resolveEnabledModules(): array
    {
        $limits = app(TenantConfigExternalServiceInterface::class)->getLimitsForCurrentTenant();

        if ($limits === null || $limits->enabledModules === null) {
            return TenantModule::values();
        }

        return $limits->enabledModules;
    }
}
