<?php

namespace Database\Seeders\Platform;

use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use App\Modules\Marketplace\Partner\Models\Partner;
use Illuminate\Database\Seeder;

/**
 * Dev seeder — đảm bảo Partner "giadung" tồn tại để khớp với storefront demo
 * resi_mart (tenant `giadung`, schema đã provision sẵn cùng dữ liệu mẫu).
 *
 * `slug` = `tenant_id` = "giadung". Idempotent — firstOrCreate theo slug.
 */
class GiaDungPartnerSeeder extends Seeder
{
    private const SLUG = 'giadung';

    public function run(): void
    {
        $partner = Partner::query()->firstOrCreate(
            ['slug' => self::SLUG],
            [
                'tenant_id' => self::SLUG,
                'name' => 'Đồ Gia Dụng Bình An',
                'display_name' => 'Đồ Gia Dụng Bình An',
                'status' => PartnerStatus::Active->value,
                'owner_email' => 'admin@giadung.vn',
                'owner_phone' => '0900000002',
                'categories' => ['home', 'appliances'],
                'description' => 'Vendor demo: cửa hàng đồ gia dụng (resi_mart tenant `giadung`).',
            ],
        );

        if ($partner->tenant_id !== self::SLUG) {
            $partner->forceFill(['tenant_id' => self::SLUG])->save();
        }

        $this->command?->info("GiaDungPartnerSeeder: Partner '".self::SLUG."' (id={$partner->id}) sẵn sàng.");
    }
}
