<?php

namespace Tests\Modules\Marketplace;

use App\Modules\Marketplace\Partner\ExternalServices\ResiMartOrderStatusService;
use App\Modules\Marketplace\Partner\ExternalServices\ResiMartProvisioningException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * Outbound S2S client gọi `PATCH /api/v1/internal/orders/{id}/status` của
 * resi_mart để platform override trạng thái đơn vendor.
 */
class ResiMartOrderStatusServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.resi_mart.url' => 'http://resi-mart.test',
            'services.resi_mart.token' => 'secret-token',
            'services.resi_mart.timeout' => 15,
        ]);
    }

    public function test_it_patches_the_internal_order_status_endpoint_with_auth_headers(): void
    {
        Http::fake([
            'http://resi-mart.test/api/v1/internal/orders/*/status' => Http::response(['data' => ['id' => 5]], 200),
        ]);

        app(ResiMartOrderStatusService::class)->overrideStatus('vendor-demo-a', 5, 'completed', 'lý do');

        Http::assertSent(function (Request $request): bool {
            return $request->method() === 'PATCH'
                && $request->url() === 'http://resi-mart.test/api/v1/internal/orders/5/status'
                && $request->hasHeader('Authorization', 'Bearer secret-token')
                && $request->hasHeader('X-Client', 'residential-management')
                && $request['tenant_id'] === 'vendor-demo-a'
                && $request['status'] === 'completed'
                && $request['reason'] === 'lý do';
        });
    }

    public function test_it_surfaces_the_resi_mart_error_message_on_http_failure(): void
    {
        Http::fake([
            'http://resi-mart.test/api/v1/internal/orders/*/status' => Http::response(
                ['success' => false, 'message' => 'Đơn hàng đã ở trạng thái Hoàn thành.'],
                422,
            ),
        ]);

        $this->expectException(ResiMartProvisioningException::class);
        $this->expectExceptionMessage('Đơn hàng đã ở trạng thái Hoàn thành.');

        app(ResiMartOrderStatusService::class)->overrideStatus('vendor-demo-a', 5, 'completed');
    }

    public function test_it_throws_when_integration_is_not_configured(): void
    {
        config(['services.resi_mart.url' => '', 'services.resi_mart.token' => '']);

        $this->expectException(ResiMartProvisioningException::class);

        app(ResiMartOrderStatusService::class)->overrideStatus('vendor-demo-a', 5, 'completed');
    }
}
