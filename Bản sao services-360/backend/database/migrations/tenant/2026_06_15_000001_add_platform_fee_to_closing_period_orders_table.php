<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('closing_period_orders', function (Blueprint $table) {
            $table->string('platform_fee_mode', 50)->nullable()->after('frozen_commission_total');
            $table->decimal('platform_fee_fixed', 15, 2)->default(0)->after('platform_fee_mode');
            $table->decimal('platform_fee_percent', 5, 2)->default(0)->after('platform_fee_fixed');
            $table->decimal('frozen_platform_fee', 15, 2)->default(0)->after('platform_fee_percent');
        });
    }

    public function down(): void
    {
        Schema::table('closing_period_orders', function (Blueprint $table) {
            $table->dropColumn([
                'platform_fee_mode',
                'platform_fee_fixed',
                'platform_fee_percent',
                'frozen_platform_fee',
            ]);
        });
    }
};
