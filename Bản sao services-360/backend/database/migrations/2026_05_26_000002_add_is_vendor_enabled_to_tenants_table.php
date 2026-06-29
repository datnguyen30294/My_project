<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table): void {
            $table->boolean('is_vendor_enabled')->default(false)->after('is_active');
            $table->index('is_vendor_enabled', 'tenants_is_vendor_enabled_index');
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table): void {
            $table->dropIndex('tenants_is_vendor_enabled_index');
            $table->dropColumn('is_vendor_enabled');
        });
    }
};
