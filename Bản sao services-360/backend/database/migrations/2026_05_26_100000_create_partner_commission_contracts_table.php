<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Central-scoped table — vendor commission contracts. Each (partner ×
     * tenant × project) has at most one `active` contract. Contracts are
     * financially immutable once `pending`; only `notes` / `contract_code`
     * can be edited until they reach a terminal state.
     */
    public function up(): void
    {
        Schema::create('partner_commission_contracts', function (Blueprint $table): void {
            $table->id();

            $table->string('contract_code', 50);
            $table->unsignedBigInteger('partner_id');
            $table->string('tenant_id', 100);
            $table->unsignedBigInteger('project_id');

            $table->string('commission_mode', 30);
            $table->json('terms');

            $table->string('status', 20)->default('draft');

            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('activated_at')->nullable();

            $table->timestamp('replaced_at')->nullable();
            $table->unsignedBigInteger('replaced_by_contract_id')->nullable();

            $table->timestamp('cancelled_at')->nullable();
            $table->unsignedBigInteger('cancelled_by')->nullable();
            $table->text('cancellation_reason')->nullable();

            $table->timestamp('signed_at')->nullable();
            $table->unsignedBigInteger('signed_by')->nullable();

            $table->text('notes')->nullable();
            $table->string('created_scope', 20)->default('platform');

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('partner_id')
                ->references('id')->on('partners')
                ->cascadeOnDelete();

            $table->foreign('replaced_by_contract_id')
                ->references('id')->on('partner_commission_contracts')
                ->nullOnDelete();

            $table->index(['partner_id', 'status']);
            $table->index(['partner_id', 'tenant_id', 'project_id']);
            $table->index('status');
            $table->index('tenant_id');
        });

        $driver = DB::connection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("CREATE UNIQUE INDEX partner_commission_contracts_active_unique
                ON partner_commission_contracts (partner_id, tenant_id, project_id)
                WHERE status = 'active' AND deleted_at IS NULL");

            DB::statement('CREATE UNIQUE INDEX partner_commission_contracts_code_unique
                ON partner_commission_contracts (contract_code)
                WHERE deleted_at IS NULL');
        } else {
            // SQLite (tests) — partial indexes use a slightly different syntax.
            DB::statement("CREATE UNIQUE INDEX partner_commission_contracts_active_unique
                ON partner_commission_contracts (partner_id, tenant_id, project_id)
                WHERE status = 'active' AND deleted_at IS NULL");

            DB::statement('CREATE UNIQUE INDEX partner_commission_contracts_code_unique
                ON partner_commission_contracts (contract_code)
                WHERE deleted_at IS NULL');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_commission_contracts');
    }
};
