<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('tax_code', 20)->nullable()->after('is_vendor_enabled');
            $table->string('representative_name', 255)->nullable()->after('tax_code');
            $table->string('contact_email', 255)->nullable()->after('representative_name');
            $table->string('contact_phone', 20)->nullable()->after('contact_email');
            $table->string('address', 500)->nullable()->after('contact_phone');
            $table->string('service_plan', 50)->default('business')->after('address');
            $table->text('notes')->nullable()->after('service_plan');
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn([
                'tax_code',
                'representative_name',
                'contact_email',
                'contact_phone',
                'address',
                'service_plan',
                'notes',
            ]);
        });
    }
};
