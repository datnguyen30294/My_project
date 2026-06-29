<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Central registry of every project across all tenant schemas. A project
     * lives inside its tenant's schema and project ids are scoped per schema
     * (not globally unique), so this table is the ONLY place a `code` can be
     * enforced unique ACROSS tenants (Postgres cannot do a cross-schema unique
     * index). It also serves as an O(1) `code => (tenant_id, project_id)` lookup
     * for the resi_mart storefront. `code`/`name`/`status` mirror the source of
     * truth in `tenant_<x>.projects` and are kept in sync by ProjectRegistrar.
     */
    public function up(): void
    {
        Schema::create('platform_projects', function (Blueprint $table): void {
            $table->id();

            $table->string('code', 50);
            $table->string('tenant_id', 50);
            $table->unsignedBigInteger('project_id');
            $table->string('name');
            $table->string('status', 50);

            $table->timestamps();
            $table->softDeletes();

            $table->index('tenant_id');
        });

        // Partial unique (Postgres & SQLite both support `WHERE`): a code/project
        // is only "taken" while not soft-deleted, matching the per-schema index
        // `projects_code_unique` so deleted codes can be reused.
        DB::statement('CREATE UNIQUE INDEX platform_projects_code_unique ON platform_projects (code) WHERE deleted_at IS NULL');
        DB::statement('CREATE UNIQUE INDEX platform_projects_tenant_project_unique ON platform_projects (tenant_id, project_id) WHERE deleted_at IS NULL');
    }

    public function down(): void
    {
        Schema::dropIfExists('platform_projects');
    }
};
