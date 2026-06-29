<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Support;

use Illuminate\Support\Facades\DB;

/**
 * Helper điều khiển search_path của connection `resi_mart_tenant` để đọc
 * dữ liệu từ schema `tenant_<vendor_slug>` của resi_mart database.
 *
 * Read-only — chỉ SELECT, không INSERT/UPDATE/DELETE.
 */
final class ResiMartConnection
{
    public const TENANT_CONNECTION = 'resi_mart_tenant';

    public const CENTRAL_CONNECTION = 'resi_mart_central';

    /**
     * Switch search_path sang tenant_<sanitizedId>.
     */
    public static function switchToTenant(string $tenantId): void
    {
        $schema = self::schemaName($tenantId);

        DB::connection(self::TENANT_CONNECTION)->statement('SET search_path TO "'.$schema.'"');
    }

    /**
     * Reset search_path về public (dùng trong finally để tránh leak schema
     * sang request khác qua connection pool).
     */
    public static function resetToPublic(): void
    {
        DB::connection(self::TENANT_CONNECTION)->statement('SET search_path TO public');
    }

    /**
     * Check schema có tồn tại trong resi_mart DB hay chưa.
     */
    public static function schemaExists(string $tenantId): bool
    {
        $schema = self::schemaName($tenantId);

        return DB::connection(self::CENTRAL_CONNECTION)
            ->table('information_schema.schemata')
            ->where('schema_name', $schema)
            ->exists();
    }

    /**
     * Check một bảng có tồn tại trong schema của tenant chưa. Dùng để degrade
     * an toàn khi resi_mart chưa migrate bảng mới (vd `order_reviews`) cho mọi
     * schema vendor — tránh "relation does not exist" làm 500 báo cáo.
     */
    public static function tableExists(string $tenantId, string $table): bool
    {
        $schema = self::schemaName($tenantId);

        return DB::connection(self::CENTRAL_CONNECTION)
            ->table('information_schema.tables')
            ->where('table_schema', $schema)
            ->where('table_name', $table)
            ->exists();
    }

    /**
     * Chạy callback trong context schema của tenant, đảm bảo reset sau cùng.
     *
     * @template T
     *
     * @param  callable():T  $callback
     * @return T
     */
    public static function runInTenantSchema(string $tenantId, callable $callback)
    {
        self::switchToTenant($tenantId);

        try {
            return $callback();
        } finally {
            self::resetToPublic();
        }
    }

    /**
     * Sanitize tenant id → schema name. Giữ a-z 0-9 _ và dấu gạch ngang để
     * khớp convention `tenant_{id}` của resi_mart (Stancl prefix `tenant_`,
     * tenant id giữ nguyên nên slug như `vendor-demo-a` → `tenant_vendor-demo-a`).
     */
    public static function schemaName(string $tenantId): string
    {
        $clean = preg_replace('/[^a-z0-9_-]/i', '', strtolower($tenantId));

        return 'tenant_'.$clean;
    }
}
