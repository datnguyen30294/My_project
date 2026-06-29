<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Central-scoped — gán hoa hồng thủ công cho TỪNG đơn vendor (resi_mart)
     * mà tại thời điểm hoàn thành KHÔNG có hợp đồng per_order áp dụng (đơn
     * "mồ côi"). Mỗi đơn (partner × vendor_order_id) có tối đa 1 override.
     *
     * Đơn vendor sống ở schema resi_mart (cross-DB, read-only); override lưu ở
     * central nên khoá theo (partner_id, vendor_order_id) — vendor_order_id chỉ
     * unique trong schema của vendor nên phải kèm partner_id.
     */
    public function up(): void
    {
        Schema::create('vendor_order_commission_overrides', function (Blueprint $table): void {
            $table->id();

            $table->unsignedBigInteger('partner_id');
            $table->unsignedBigInteger('vendor_order_id');
            $table->string('tenant_id', 100)->nullable();
            $table->unsignedBigInteger('project_id')->nullable();

            $table->string('revenue_recipient', 30);
            $table->json('terms');
            $table->unsignedBigInteger('source_contract_id')->nullable();

            $table->text('note')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('partner_id')
                ->references('id')->on('partners')
                ->cascadeOnDelete();

            $table->foreign('source_contract_id')
                ->references('id')->on('partner_commission_contracts')
                ->nullOnDelete();

            $table->index(['partner_id', 'vendor_order_id']);
            $table->index('tenant_id');
        });

        DB::statement('CREATE UNIQUE INDEX vendor_order_commission_overrides_order_unique
            ON vendor_order_commission_overrides (partner_id, vendor_order_id)
            WHERE deleted_at IS NULL');
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_order_commission_overrides');
    }
};
