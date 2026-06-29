<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Per-(partner, project) pause switch. When false the partner stays linked
     * to the project (the pivot row is kept, history preserved) but is
     * temporarily not allowed to serve it. resi_mart honours this flag in its
     * `partner_project` reads alongside the existing `deleted_at` check.
     *
     * Defaults to true so every existing link keeps working unchanged.
     */
    public function up(): void
    {
        Schema::table('partner_project', function (Blueprint $table): void {
            $table->boolean('is_vendor_enabled')->default(true)->after('project_id');
            $table->index('is_vendor_enabled');
        });
    }

    public function down(): void
    {
        Schema::table('partner_project', function (Blueprint $table): void {
            $table->dropIndex(['is_vendor_enabled']);
            $table->dropColumn('is_vendor_enabled');
        });
    }
};
