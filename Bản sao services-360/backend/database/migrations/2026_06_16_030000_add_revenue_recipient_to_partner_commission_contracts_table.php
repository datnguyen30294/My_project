<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Who keeps the vendor commission of each order: the platform (TNP) or the
     * PMC operating company that runs the project (the contract's `tenant_id`).
     *
     * Belongs to the financial-immutable group alongside `commission_mode` /
     * `terms` — editable only while the contract is a draft. Defaults to
     * `platform` so every existing contract keeps its current behaviour.
     */
    public function up(): void
    {
        Schema::table('partner_commission_contracts', function (Blueprint $table): void {
            $table->string('revenue_recipient', 30)->default('platform')->after('terms');
        });
    }

    public function down(): void
    {
        Schema::table('partner_commission_contracts', function (Blueprint $table): void {
            $table->dropColumn('revenue_recipient');
        });
    }
};
