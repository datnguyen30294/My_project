<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\VendorOrder\Enums\VendorOrderPaymentStatus;
use Tests\TestCase;

/**
 * `VendorOrderPaymentStatus` là bản mirror read-only của enum payment status bên
 * resi_mart (`Vendor/Order/Enums/PaymentStatus`). Thiếu giá trị nào → model cast
 * ném ValueError ⇒ 500 ở detail. Test khoá đủ 4 giá trị resi_mart hiện có để
 * tránh lệch mirror tái diễn (vd `partially_paid` từng bị thiếu).
 */
class VendorOrderPaymentStatusTest extends TestCase
{
    public function test_covers_all_resi_mart_payment_statuses(): void
    {
        $expected = ['unpaid', 'partially_paid', 'paid', 'refunded'];

        $this->assertSame($expected, VendorOrderPaymentStatus::values());

        foreach ($expected as $value) {
            $this->assertNotNull(VendorOrderPaymentStatus::tryFrom($value));
        }
    }

    public function test_partially_paid_has_label(): void
    {
        $this->assertSame('Thanh toán một phần', VendorOrderPaymentStatus::PartiallyPaid->label());
    }
}
