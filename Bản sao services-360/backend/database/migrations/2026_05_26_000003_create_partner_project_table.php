<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Central-scoped pivot — which marketplace partners are allowed to sell at
     * which projects of which PMC tenant.
     *
     * Lives in `public` schema together with `partners`. resi_mart reads this
     * table directly via its `pmc_central` connection — no per-tenant fan-out
     * is required.
     *
     * `tenant_id` is the PMC tenant slug (matches `tenants.id`).
     * `project_id` is the PK of the project inside that tenant's DB; the
     * `(tenant_id, project_id)` pair fully identifies a project across the
     * platform.
     */
    public function up(): void
    {
        Schema::create('partner_project', function (Blueprint $table): void {
            $table->id();

            $table->unsignedBigInteger('partner_id');
            $table->string('tenant_id', 100);
            $table->unsignedBigInteger('project_id');

            $table->timestamp('registered_at');

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('partner_id')
                ->references('id')
                ->on('partners')
                ->cascadeOnDelete();

            $table->index('partner_id');
            $table->index(['tenant_id', 'project_id']);
        });

        DB::statement('CREATE UNIQUE INDEX partner_project_natural_unique ON partner_project (partner_id, tenant_id, project_id) WHERE deleted_at IS NULL');
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_project');
    }
};
