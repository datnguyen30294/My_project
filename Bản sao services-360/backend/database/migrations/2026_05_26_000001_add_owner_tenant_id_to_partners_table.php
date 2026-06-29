<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('partners', function (Blueprint $table): void {
            $table->string('owner_tenant_id', 100)->nullable()->after('tenant_id');
            $table->index('owner_tenant_id', 'partners_owner_tenant_id_index');
        });
    }

    public function down(): void
    {
        Schema::table('partners', function (Blueprint $table): void {
            $table->dropIndex('partners_owner_tenant_id_index');
            $table->dropColumn('owner_tenant_id');
        });
    }
};
