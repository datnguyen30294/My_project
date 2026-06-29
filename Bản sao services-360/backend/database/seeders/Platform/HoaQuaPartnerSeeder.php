<?php

namespace Database\Seeders\Platform;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use Illuminate\Database\Seeder;

/**
 * Dev seeder — đảm bảo Partner "hoaqua" tồn tại để khớp với vendor web
 * resi_mart đang chạy ở http://hoaqua.localhost:3004.
 *
 * `slug` = `tenant_id` = "hoaqua" (resi_mart đã provision schema sẵn).
 * Idempotent — dùng firstOrCreate theo slug.
 */
class HoaQuaPartnerSeeder extends Seeder
{
    private const SLUG = 'hoaqua';

    public function run(): void
    {
        $partner = Partner::query()->firstOrCreate(
            ['slug' => self::SLUG],
            [
                'tenant_id' => self::SLUG,
                'name' => 'Hoa Quả Sạch',
                'display_name' => 'Hoa Quả Sạch',
                'status' => PartnerStatus::Active->value,
                'owner_email' => 'admin@hoaqua.vn',
                'owner_phone' => '0900000001',
                'categories' => ['food', 'grocery'],
                'description' => 'Vendor demo: cửa hàng hoa quả sạch (resi_mart tenant `hoaqua`).',
            ],
        );

        // Nếu Partner đã tồn tại từ trước nhưng chưa được map tenant_id thì gán lại.
        if ($partner->tenant_id !== self::SLUG) {
            $partner->forceFill(['tenant_id' => self::SLUG])->save();
        }

        $this->command?->info("HoaQuaPartnerSeeder: Partner '".self::SLUG."' (id={$partner->id}) sẵn sàng.");
    }
}
