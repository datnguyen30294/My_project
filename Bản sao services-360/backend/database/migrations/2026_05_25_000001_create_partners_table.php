<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Central-scoped table — master list of marketplace partners (vendors).
     *
     * Lives in `public` schema (NOT tenant-scoped). Platform admin CRUDs;
     * resi_mart reads via `pmc_central` connection (read-only SELECT).
     *
     * `tenant_id` is the schema-routing id used by resi_mart's stancl
     * Tenant model (string, e.g. "hoaqua"). It is nullable until resi_mart
     * provisions the schema; same value as `slug` once provisioned.
     */
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table): void {
            $table->id();

            $table->string('slug', 100);
            $table->string('tenant_id', 100)->nullable();
            $table->string('name', 255);
            $table->string('display_name', 255)->nullable();
            $table->string('status', 20)->default('active');
            $table->string('custom_domain', 255)->nullable();
            $table->json('categories')->nullable();

            $table->string('owner_email', 255);
            $table->string('owner_phone', 30)->nullable();
            $table->string('logo_url', 500)->nullable();
            $table->text('description')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('tenant_id');
        });

        DB::statement('CREATE UNIQUE INDEX partners_slug_unique ON partners (slug) WHERE deleted_at IS NULL');
        DB::statement('CREATE UNIQUE INDEX partners_custom_domain_unique ON partners (custom_domain) WHERE deleted_at IS NULL AND custom_domain IS NOT NULL');
        DB::statement('CREATE UNIQUE INDEX partners_tenant_id_unique ON partners (tenant_id) WHERE deleted_at IS NULL AND tenant_id IS NOT NULL');
    }

    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
