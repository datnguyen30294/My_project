<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Explanatory line items for a tenant service order. The parent order
     * `amount` is the source of truth — lines only break the figure down and
     * are hard-deleted together with the parent.
     */
    public function up(): void
    {
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

    public function down(): void
    {
        Schema::dropIfExists('tenant_service_order_lines');
    }
};
