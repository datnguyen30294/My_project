<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\PartnerCommissionContract\Enums\RevenueRecipient;
use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderStatus;
use App\Modules\Marketplace\VendorOrder\Resources\VendorOrderCommissionResource;
use App\Modules\Marketplace\VendorOrder\Resources\VendorOrderListResource;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Tests\TestCase;

/**
 * Hợp đồng commission gắn theo (vendor, tenant, dự án) và không backdate được,
 * nên đơn completed chưa khớp hợp đồng phải rơi về HOA HỒNG MẶC ĐỊNH 0đ
 * (source = 'default') thay vì để trống. Test này khoá contract serialize
 * `source` cho cả 3 nguồn — đây là hợp đồng dữ liệu FE dựa vào để hiển thị
 * badge "Mặc định" và quyết định nút "Gán hoa hồng".
 */
class VendorOrderCommissionSourceResourceTest extends TestCase
{
    private function order(): object
    {
        return (object) [
            'id' => 1,
            'code' => 'VO-1',
            'project_id' => 10,
            'total' => 1_000_000.0,
            'status' => VendorOrderStatus::Completed,
            'completed_at' => null,
            'created_at' => null,
            'customer' => null,
            'items' => new Collection([(object) ['product_name' => 'Sản phẩm A', 'item_type' => 'product']]),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function zeroFormula(): array
    {
        return [
            'fixed' => 0.0,
            'percent' => 0.0,
            'remainder_after_fixed' => 0.0,
            'percent_amount' => 0.0,
            'total' => 0.0,
            'capped_at_total' => false,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function defaultCommission(): array
    {
        return [
            'contract' => null,
            'recipient' => RevenueRecipient::Platform,
            'formula' => $this->zeroFormula(),
            'amount' => 0.0,
            'applied_at' => null,
            'manual' => false,
            'override_id' => null,
            'contract_code' => null,
            'source' => 'default',
        ];
    }

    public function test_list_resource_marks_default_zero_commission(): void
    {
        $array = (new VendorOrderListResource([
            'order' => $this->order(),
            'project_name' => 'Dự án X',
            'type' => 'product',
            'commission' => $this->defaultCommission(),
        ]))->toArray(new Request);

        $commission = $array['commission'];

        $this->assertSame('default', $commission['source']);
        $this->assertSame(0.0, $commission['amount']);
        $this->assertNull($commission['contract_id']);
        $this->assertNull($commission['override_id']);
        $this->assertFalse($commission['is_manual']);
        $this->assertSame('platform', $commission['revenue_recipient']['value']);
    }

    public function test_list_resource_keeps_null_for_non_completed_order(): void
    {
        $array = (new VendorOrderListResource([
            'order' => $this->order(),
            'project_name' => 'Dự án X',
            'type' => 'product',
            'commission' => null,
        ]))->toArray(new Request);

        $this->assertNull($array['commission']);
    }

    public function test_commission_resource_marks_default_source(): void
    {
        $array = (new VendorOrderCommissionResource($this->defaultCommission()))->toArray(new Request);

        $this->assertSame('default', $array['source']);
        $this->assertNull($array['contract']);
        $this->assertFalse($array['is_manual']);
        $this->assertSame(0.0, $array['amount']);
        $this->assertSame('platform', $array['revenue_recipient']['value']);
    }

    public function test_commission_resource_infers_source_when_missing(): void
    {
        $manual = $this->defaultCommission();
        unset($manual['source']);
        $manual['manual'] = true;
        $manual['override_id'] = 99;

        $array = (new VendorOrderCommissionResource($manual))->toArray(new Request);

        $this->assertSame('manual', $array['source']);
        $this->assertSame(99, $array['override_id']);
    }
}
