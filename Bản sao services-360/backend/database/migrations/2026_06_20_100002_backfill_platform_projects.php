<?php

declare(strict_types=1);

use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Populate `platform_projects` from every existing project across all tenant
     * schemas. Aborts if it finds the same `code` under more than one tenant —
     * such data would make the cross-tenant unique guarantee impossible and must
     * be resolved by hand before enabling the registry. Idempotent (updateOrInsert).
     */
    public function up(): void
    {
        $central = config('tenancy.database.central_connection');
        $rows = [];
        $codeOwners = [];
        $conflicts = [];

        foreach (Organization::all() as $tenant) {
            $tenantId = (string) $tenant->getTenantKey();

            try {
                $projects = $tenant->run(function () {
                    if (! Schema::hasTable('projects')) {
                        return collect();
                    }

                    return DB::table('projects')
                        ->whereNull('deleted_at')
                        ->get(['id', 'code', 'name', 'status']);
                });
            } catch (\Throwable) {
                // Tenant schema not migrated / unreachable — skip, nothing to backfill.
                continue;
            }

            foreach ($projects as $project) {
                $code = (string) $project->code;

                if (isset($codeOwners[$code]) && $codeOwners[$code] !== $tenantId) {
                    $conflicts[] = sprintf('code "%s": %s & %s', $code, $codeOwners[$code], $tenantId);

                    continue;
                }

                $codeOwners[$code] = $tenantId;
                $rows[] = [
                    'tenant_id' => $tenantId,
                    'project_id' => (int) $project->id,
                    'code' => $code,
                    'name' => (string) $project->name,
                    'status' => (string) $project->status,
                ];
            }
        }

        if ($conflicts !== []) {
            throw new \RuntimeException(
                'Không thể backfill platform_projects: mã dự án trùng giữa các CTVH — '
                .implode('; ', $conflicts)
                .'. Hãy đổi mã trùng thủ công rồi chạy lại migration.'
            );
        }

        $now = now();

        foreach ($rows as $row) {
            DB::connection($central)->table('platform_projects')->updateOrInsert(
                ['tenant_id' => $row['tenant_id'], 'project_id' => $row['project_id']],
                [
                    'code' => $row['code'],
                    'name' => $row['name'],
                    'status' => $row['status'],
                    'deleted_at' => null,
                    'updated_at' => $now,
                    'created_at' => $now,
                ],
            );
        }
    }

    public function down(): void
    {
        DB::connection(config('tenancy.database.central_connection'))
            ->table('platform_projects')
            ->truncate();
    }
};
