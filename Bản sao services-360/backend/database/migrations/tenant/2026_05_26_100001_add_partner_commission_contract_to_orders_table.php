<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add cross-DB snapshot references to `orders`. The contract itself lives
     * in the central DB (`partner_commission_contracts`); these columns are
     * for audit/lookup only — they are NOT foreign keys.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->unsignedBigInteger('partner_id')->nullable()->after('status');
            $table->unsignedBigInteger('partner_commission_contract_id')->nullable()->after('partner_id');

            $table->index('partner_id');
            $table->index('partner_commission_contract_id');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->dropIndex(['partner_id']);
            $table->dropIndex(['partner_commission_contract_id']);
            $table->dropColumn(['partner_id', 'partner_commission_contract_id']);
        });
    }
};
