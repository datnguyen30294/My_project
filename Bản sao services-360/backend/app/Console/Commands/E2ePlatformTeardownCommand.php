<?php

namespace App\Console\Commands;

use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Throwable;

class E2ePlatformTeardownCommand extends Command
{
    protected $signature = 'e2e:platform-teardown {orgCode=e2eplat} {vendorSlug=e2evendor}';

    protected $description = 'Remove the throwaway E2E platform tenant + vendor (both residential & resi_mart)';

    public function handle(): int
    {
        if (! in_array(app()->environment(), ['local', 'testing'], true)) {
            $this->error('Only runnable in local/testing.');

            return self::FAILURE;
        }

        $orgCode = (string) $this->argument('orgCode');
        $vendorSlug = (string) $this->argument('vendorSlug');
        $central = config('tenancy.database.central_connection');

        $this->safe(fn () => DB::connection($central)->table('partner_commission_contracts')
            ->whereIn('partner_id', DB::connection($central)->table('partners')->where('slug', $vendorSlug)->pluck('id'))
            ->delete());
        $this->safe(fn () => DB::connection($central)->table('partner_project')
            ->where('tenant_id', $orgCode)->delete());
        $this->safe(fn () => DB::connection($central)->table('partners')->where('slug', $vendorSlug)->delete());

        $this->safe(function () use ($orgCode, $central) {
            $tenant = Organization::find($orgCode);
            if ($tenant) {
                $tenant->domains()->delete();
            }
            $schema = config('tenancy.database.prefix').$orgCode.config('tenancy.database.suffix');
            DB::connection($central)->table('tenants')->where('id', $orgCode)->delete();
            DB::connection($central)->statement("DROP SCHEMA IF EXISTS \"{$schema}\" CASCADE");
        });

        $this->safe(function () use ($vendorSlug) {
            DB::connection('resi_mart_central')->statement("DROP SCHEMA IF EXISTS \"tenant_{$vendorSlug}\" CASCADE");
            DB::connection('resi_mart_central')->table('domains')->where('tenant_id', $vendorSlug)->delete();
            DB::connection('resi_mart_central')->table('tenants')->where('id', $vendorSlug)->delete();
        });

        $this->info("E2E platform teardown done: tenant={$orgCode}, vendor={$vendorSlug}");

        return self::SUCCESS;
    }

    private function safe(callable $fn): void
    {
        try {
            $fn();
        } catch (Throwable $e) {
            $this->warn('  skip: '.$e->getMessage());
        }
    }
}
