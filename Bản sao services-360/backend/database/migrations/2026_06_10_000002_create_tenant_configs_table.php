<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenant_configs', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id', 50)->unique();
            $table->foreign('tenant_id')->references('id')->on('tenants');
            $table->integer('max_projects')->default(10);
            $table->integer('max_accounts')->default(50);
            $table->integer('session_timeout_minutes')->default(480);
            $table->boolean('resident_portal_enabled')->default(true);
            $table->boolean('partner_portal_enabled')->default(true);
            $table->string('fee_mode', 50)->default('none');
            $table->string('subscription_cycle', 20)->default('monthly');
            $table->decimal('subscription_amount', 15, 2)->default(0);
            $table->decimal('fixed_fee_per_order', 15, 2)->default(0);
            $table->decimal('percent_fee_per_order', 5, 2)->default(0);
            $table->json('enabled_modules')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenant_configs');
    }
};
