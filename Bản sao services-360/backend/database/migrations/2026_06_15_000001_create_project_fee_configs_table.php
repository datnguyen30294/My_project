<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Central-scoped override of the platform fee + operational flags per
     * project of a tenant. A project lives inside its tenant's schema, so the
     * business key is the pair (organization_id, project_id). `organization_id`
     * is the tenant slug (matches `tenants.id`); `project_id` is the PK of the
     * project inside that tenant's schema — no cross-schema FK is possible.
     */
    public function up(): void
    {
        Schema::create('project_fee_configs', function (Blueprint $table): void {
            $table->id();

            $table->string('organization_id', 50);
            $table->unsignedBigInteger('project_id');

            $table->boolean('inherit_default')->default(true);
            $table->string('fee_mode', 50)->nullable();
            $table->decimal('fixed_fee_per_order', 15, 2)->default(0);
            $table->decimal('percent_fee_per_order', 5, 2)->default(0);
            $table->decimal('subscription_amount', 15, 2)->default(0);
            $table->string('subscription_cycle', 50)->nullable();
            $table->boolean('platform_service_enabled')->default(true);
            $table->text('notes')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('organization_id')
                ->references('id')
                ->on('tenants')
                ->cascadeOnDelete();

            $table->index('organization_id');
        });

        DB::statement('CREATE UNIQUE INDEX project_fee_configs_org_project_unique ON project_fee_configs (organization_id, project_id) WHERE deleted_at IS NULL');
    }

    public function down(): void
    {
        Schema::dropIfExists('project_fee_configs');
    }
};
