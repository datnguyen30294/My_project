<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use Tests\TestCase;

class ResiMartConnectionTest extends TestCase
{
    public function test_schema_name_preserves_hyphens_to_match_resi_mart(): void
    {
        $this->assertSame('tenant_vendor-demo-a', ResiMartConnection::schemaName('vendor-demo-a'));
    }

    public function test_schema_name_keeps_plain_slug(): void
    {
        $this->assertSame('tenant_giadung', ResiMartConnection::schemaName('giadung'));
    }

    public function test_schema_name_lowercases_input(): void
    {
        $this->assertSame('tenant_vendor-demo-a', ResiMartConnection::schemaName('Vendor-Demo-A'));
    }

    public function test_schema_name_strips_unsafe_characters(): void
    {
        $this->assertSame('tenant_evildropschema-x', ResiMartConnection::schemaName('evil"; drop schema-x'));
    }
}
