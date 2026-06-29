<?php

namespace Tests\Modules\PMC;

use App\Common\Exceptions\BusinessException;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Project\ExternalServices\Platform\TenantProjectExternalService;
use App\Modules\PMC\Project\Models\PlatformProjectRegistry;
use App\Modules\PMC\Project\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformProjectRegistryTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        if (function_exists('tenancy') && tenancy()->initialized) {
            tenancy()->end();
        }

        parent::tearDown();
    }

    private function makeTenant(string $id): Organization
    {
        return Organization::withoutEvents(
            fn () => Organization::factory()->create(['id' => $id, 'is_active' => true])
        );
    }

    private function createProject(Organization $tenant, string $code, string $name): array
    {
        return app(TenantProjectExternalService::class)->createProject($tenant, [
            'code' => $code,
            'name' => $name,
        ]);
    }

    public function test_creating_a_project_syncs_the_central_registry(): void
    {
        $tenant = $this->makeTenant('tnp');

        $project = $this->createProject($tenant, 'DA-CC-A', 'Dự án Chung cư A');

        $this->assertDatabaseHas('platform_projects', [
            'tenant_id' => 'tnp',
            'project_id' => $project['id'],
            'code' => 'DA-CC-A',
            'name' => 'Dự án Chung cư A',
            'deleted_at' => null,
        ]);
    }

    public function test_duplicate_code_across_tenants_is_rejected_and_rolled_back(): void
    {
        // Another tenant already owns this code in the registry.
        PlatformProjectRegistry::create([
            'tenant_id' => 'vh-other',
            'project_id' => 99,
            'code' => 'DA-DUP',
            'name' => 'Đã tồn tại ở CTVH khác',
            'status' => 'managing',
        ]);

        $tenant = $this->makeTenant('tnp');

        $threw = false;

        try {
            $this->createProject($tenant, 'DA-DUP', 'Phải bị chặn');
        } catch (BusinessException $e) {
            $threw = true;
            $this->assertSame('PROJECT_CODE_DUPLICATE_PLATFORM', $e->getErrorCode());
        }

        $this->assertTrue($threw, 'Tạo dự án trùng mã cross-tenant phải bị chặn.');

        // Rollback: the project must NOT have been persisted in the tenant schema.
        $persisted = $tenant->run(fn () => Project::query()->where('code', 'DA-DUP')->withTrashed()->count());
        $this->assertSame(0, $persisted, 'Đơn tạo phải bị rollback khi registry chặn.');
    }

    public function test_renaming_code_updates_the_registry(): void
    {
        $tenant = $this->makeTenant('tnp');
        $project = $this->createProject($tenant, 'OLD-CODE', 'Tên');

        $tenant->run(function () use ($project): void {
            Project::query()->findOrFail($project['id'])->update(['code' => 'NEW-CODE']);
        });

        $this->assertDatabaseHas('platform_projects', [
            'tenant_id' => 'tnp',
            'project_id' => $project['id'],
            'code' => 'NEW-CODE',
        ]);
        $this->assertDatabaseMissing('platform_projects', [
            'code' => 'OLD-CODE',
            'deleted_at' => null,
        ]);
    }

    public function test_soft_deleting_a_project_frees_the_code(): void
    {
        $tenant = $this->makeTenant('tnp');
        $project = $this->createProject($tenant, 'DA-DEL', 'Sẽ xoá');

        $tenant->run(function () use ($project): void {
            Project::query()->findOrFail($project['id'])->delete();
        });

        // No active registry row remains → code is reusable.
        $this->assertDatabaseMissing('platform_projects', [
            'code' => 'DA-DEL',
            'deleted_at' => null,
        ]);
    }
}
