<?php

namespace Tests\Modules\Platform;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Customer\Models\Customer;
use App\Modules\PMC\OgTicket\Models\OgTicket;
use App\Modules\PMC\Project\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantResidentRatingListingTest extends TestCase
{
    use RefreshDatabase;

    private RequesterAccount $requester;

    private Organization $tenant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->requester = RequesterAccount::create([
            'name' => 'Platform Admin',
            'email' => 'admin@test.com',
            'password' => 'password',
            'is_active' => true,
        ]);

        $this->tenant = Organization::withoutEvents(
            fn () => Organization::factory()->create(['id' => 'vh-test'])
        );
    }

    protected function tearDown(): void
    {
        if (function_exists('tenancy') && tenancy()->initialized) {
            tenancy()->end();
        }

        parent::tearDown();
    }

    private function actingAsRequester(): static
    {
        return $this->actingAs($this->requester, 'requester');
    }

    private function baseUrl(?string $tenantId = null): string
    {
        return '/api/v1/platform/tenants/'.($tenantId ?? $this->tenant->id).'/resident-ratings';
    }

    private function createRatedTicket(int $rating, array $overrides = []): OgTicket
    {
        return OgTicket::factory()->rated($rating)->create($overrides);
    }

    // ========== LIST ==========

    public function test_list_returns_rated_tickets_sorted_by_rated_at_desc_with_summary(): void
    {
        $project = Project::factory()->create(['name' => 'Chung cư Alpha']);
        $customer = Customer::factory()->create(['full_name' => 'Trần Thị B']);

        $older = $this->createRatedTicket(4, [
            'project_id' => $project->id,
            'customer_id' => $customer->id,
            'subject' => 'Sửa điều hoà',
            'resident_rating_comment' => 'Ổn',
            'resident_rated_at' => now()->subDay(),
        ]);
        $newer = $this->createRatedTicket(5, [
            'subject' => 'Thay bóng đèn',
            'resident_rating_comment' => 'Giao nhanh, nhân viên thân thiện',
            'resident_rated_at' => now(),
        ]);

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('summary.average', 4.5)
            ->assertJsonPath('summary.count', 2)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.ticket_id', $newer->ticket_id)
            ->assertJsonPath('data.0.subject', 'Thay bóng đèn')
            ->assertJsonPath('data.0.rating', 5)
            ->assertJsonPath('data.0.comment', 'Giao nhanh, nhân viên thân thiện')
            ->assertJsonPath('data.1.ticket_id', $older->ticket_id)
            ->assertJsonPath('data.1.project_name', 'Chung cư Alpha')
            ->assertJsonPath('data.1.resident_name', 'Trần Thị B')
            ->assertJsonPath('data.1.rating', 4);

        $this->assertNotNull($response->json('data.0.ticket_code'));
        $this->assertNotNull($response->json('data.0.rated_at'));
    }

    public function test_list_excludes_unrated_tickets(): void
    {
        OgTicket::factory()->completed()->create();
        $this->createRatedTicket(3);

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()
            ->assertJsonPath('summary.count', 1)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.rating', 3);
    }

    public function test_list_returns_empty_summary_when_no_ratings(): void
    {
        OgTicket::factory()->completed()->create();

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()
            ->assertJsonPath('summary.average', null)
            ->assertJsonPath('summary.count', 0)
            ->assertJsonCount(0, 'data');
    }

    public function test_summary_average_is_rounded_to_one_decimal(): void
    {
        $this->createRatedTicket(5);
        $this->createRatedTicket(4);
        $this->createRatedTicket(4);

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()->assertJsonPath('summary.average', 4.3);
    }

    // ========== FILTER ==========

    public function test_list_filters_by_rating_but_summary_stays_global(): void
    {
        $this->createRatedTicket(5);
        $this->createRatedTicket(5);
        $this->createRatedTicket(2);

        $response = $this->actingAsRequester()->getJson($this->baseUrl().'?rating=5');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('summary.average', 4)
            ->assertJsonPath('summary.count', 3);
    }

    public function test_list_rejects_invalid_rating(): void
    {
        $this->actingAsRequester()
            ->getJson($this->baseUrl().'?rating=6')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['rating']);

        $this->actingAsRequester()
            ->getJson($this->baseUrl().'?rating=0')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['rating']);
    }

    // ========== PAGINATION ==========

    public function test_list_paginates_with_per_page(): void
    {
        $this->createRatedTicket(5);
        $this->createRatedTicket(4);
        $this->createRatedTicket(3);

        $response = $this->actingAsRequester()->getJson($this->baseUrl().'?per_page=2');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 3)
            ->assertJsonPath('meta.per_page', 2)
            ->assertJsonPath('meta.last_page', 2);

        $page2 = $this->actingAsRequester()->getJson($this->baseUrl().'?per_page=2&page=2');

        $page2->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.current_page', 2);
    }

    // ========== PRIVACY ==========

    public function test_list_does_not_expose_resident_phone_or_address(): void
    {
        $this->createRatedTicket(5);

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk();

        $this->assertSame(
            ['ticket_id', 'ticket_code', 'subject', 'project_name', 'resident_name', 'rating', 'comment', 'rated_at'],
            array_keys($response->json('data.0')),
        );
    }

    public function test_resident_name_falls_back_to_requester_name_without_customer(): void
    {
        $this->createRatedTicket(4, [
            'customer_id' => null,
            'requester_name' => 'Nguyễn Văn A',
        ]);

        $this->actingAsRequester()->getJson($this->baseUrl())
            ->assertOk()
            ->assertJsonPath('data.0.resident_name', 'Nguyễn Văn A');
    }

    // ========== EDGE CASES ==========

    public function test_list_excludes_soft_deleted_tickets(): void
    {
        $this->createRatedTicket(5);
        $this->createRatedTicket(1)->delete();

        $response = $this->actingAsRequester()->getJson($this->baseUrl());

        $response->assertOk()
            ->assertJsonPath('summary.count', 1)
            ->assertJsonCount(1, 'data');
    }

    public function test_list_works_for_inactive_tenant(): void
    {
        $this->tenant->update(['is_active' => false]);
        $this->createRatedTicket(5);

        $this->actingAsRequester()->getJson($this->baseUrl())
            ->assertOk()
            ->assertJsonPath('summary.count', 1);
    }

    public function test_list_returns_404_for_nonexistent_tenant(): void
    {
        $this->actingAsRequester()
            ->getJson($this->baseUrl('khong-ton-tai'))
            ->assertStatus(404);
    }

    public function test_list_requires_authentication(): void
    {
        $this->getJson($this->baseUrl())->assertStatus(401);
    }
}
