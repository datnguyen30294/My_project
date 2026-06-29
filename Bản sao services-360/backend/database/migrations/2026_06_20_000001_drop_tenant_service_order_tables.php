<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Drop the B2B tenant service order tables — the "Đơn dịch vụ vận hành"
     * console was retired. Lines are dropped first because they hold the FK to
     * the parent order. `down()` recreates both tables to keep the migration
     * reversible.
     */
    public function up(): void
    {
        Schema::dropIfExists('tenant_service_order_lines');
        Schema::dropIfExists('tenant_service_orders');
    }

    public function down(): void
    {
        Schema::create('tenant_service_orders', function (Blueprint $table): void {
            $table->id();

            $table->string('code', 50);
            $table->string('organization_id', 50);
            $table->string('order_type', 30);
            $table->string('status', 30)->default('draft');
            $table->string('title', 255);
            $table->string('service_plan', 30)->nullable();
            $table->date('billing_period_start')->nullable();
            $table->date('billing_period_end')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->timestamp('paid_at')->nullable();
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
            $table->index('order_type');
            $table->index('status');
        });

        DB::statement('CREATE UNIQUE INDEX tenant_service_orders_code_unique ON tenant_service_orders (code) WHERE deleted_at IS NULL');

        Schema::create('tenant_service_order_lines', function (Blueprint $table): void {
            $table->id();

            $table->foreignId('order_id')
                ->constrained('tenant_service_orders')
                ->cascadeOnDelete();

            $table->string('description', 255);
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('line_total', 15, 2)->default(0);

            $table->timestamps();
        });
    }
};
