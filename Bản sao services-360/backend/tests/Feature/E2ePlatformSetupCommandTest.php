<?php

namespace Tests\Feature;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class E2ePlatformSetupCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_setup_seeds_platform_admin_idempotently(): void
    {
        $this->artisan('e2e:platform-setup')->assertSuccessful();
        $this->artisan('e2e:platform-setup')->assertSuccessful();

        $admins = RequesterAccount::where('email', 'e2e-platform@test.com')->get();
        $this->assertCount(1, $admins);
        $this->assertTrue($admins->first()->is_active);
    }
}
