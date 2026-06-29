<?php

declare(strict_types=1);

namespace App\Modules\PMC\Account\ExternalServices\Platform;

use App\Common\Exceptions\BusinessException;
use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\PMC\Account\Contracts\AccountServiceInterface;
use App\Modules\PMC\Account\Models\Account;
use App\Modules\PMC\Account\Models\Role;
use App\Modules\PMC\Account\Repositories\AccountRepository;
use App\Modules\PMC\Department\Models\Department;
use App\Modules\PMC\JobTitle\Models\JobTitle;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

class TenantAccountExternalService implements TenantAccountExternalServiceInterface
{
    public function listAccounts(Organization $tenant, array $filters): LengthAwarePaginator
    {
        return $tenant->run(function () use ($filters): LengthAwarePaginator {
            $paginator = app(AccountRepository::class)->list($filters);

            $paginator->through(fn (Account $account): array => $this->mapAccount($account));

            return $paginator;
        });
    }

    public function getFormOptions(Organization $tenant): array
    {
        return $tenant->run(function (): array {
            return [
                'departments' => Department::query()
                    ->orderBy('name')
                    ->get(['id', 'name'])
                    ->map(fn (Department $department): array => [
                        'id' => (int) $department->id,
                        'name' => (string) $department->name,
                    ])
                    ->all(),
                'job_titles' => JobTitle::query()
                    ->orderBy('name')
                    ->get(['id', 'name'])
                    ->map(fn (JobTitle $jobTitle): array => [
                        'id' => (int) $jobTitle->id,
                        'name' => (string) $jobTitle->name,
                    ])
                    ->all(),
                'roles' => Role::query()
                    ->active()
                    ->orderBy('name')
                    ->get(['id', 'name'])
                    ->map(fn (Role $role): array => [
                        'id' => (int) $role->id,
                        'name' => (string) $role->name,
                    ])
                    ->all(),
            ];
        });
    }

    public function createAccount(Organization $tenant, array $data): array
    {
        return $tenant->run(function () use ($data): array {
            $this->ensureEmailAvailable((string) $data['email']);
            $this->ensureReferencesExist($data);

            $account = app(AccountServiceInterface::class)->create($data);

            return $this->mapAccount($account->refresh());
        });
    }

    public function updateAccount(Organization $tenant, int $accountId, array $data): array
    {
        return $tenant->run(function () use ($accountId, $data): array {
            if (blank($data['password'] ?? null)) {
                unset($data['password']);
            }

            if (isset($data['email'])) {
                $this->ensureEmailAvailable((string) $data['email'], $accountId);
            }

            $this->ensureReferencesExist($data);

            $account = app(AccountServiceInterface::class)->update($accountId, $data);

            return $this->mapAccount($account);
        });
    }

    /**
     * Unique email check chạy trong tenant context (Form Request ở central
     * không query đúng schema được). Tính cả bản ghi soft-deleted theo đúng
     * behavior unique index của bảng accounts.
     */
    private function ensureEmailAvailable(string $email, ?int $exceptId = null): void
    {
        $exists = Account::withTrashed()
            ->where('email', $email)
            ->when($exceptId !== null, fn ($query) => $query->whereKeyNot($exceptId))
            ->exists();

        if ($exists) {
            throw new BusinessException(
                message: 'Email đã tồn tại.',
                errorCode: 'EMAIL_ALREADY_EXISTS',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }
    }

    /**
     * FK existence checks thay cho Rule::exists (validator chạy ở central
     * context nên phải kiểm tra trong tenant schema tại đây).
     *
     * @param  array<string, mixed>  $data
     */
    private function ensureReferencesExist(array $data): void
    {
        if (isset($data['department_ids'])) {
            $departmentIds = collect($data['department_ids'])->map(fn ($id) => (int) $id)->unique();

            $foundCount = Department::query()->whereIn('id', $departmentIds)->count();

            if ($foundCount !== $departmentIds->count()) {
                throw new BusinessException(
                    message: 'Phòng ban không tồn tại.',
                    errorCode: 'DEPARTMENT_NOT_FOUND',
                    httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
                );
            }
        }

        if (isset($data['job_title_id']) && ! JobTitle::query()->whereKey((int) $data['job_title_id'])->exists()) {
            throw new BusinessException(
                message: 'Chức danh không tồn tại.',
                errorCode: 'JOB_TITLE_NOT_FOUND',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        if (isset($data['role_id']) && ! Role::query()->whereKey((int) $data['role_id'])->exists()) {
            throw new BusinessException(
                message: 'Vai trò không tồn tại.',
                errorCode: 'ROLE_NOT_FOUND',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function mapAccount(Account $account): array
    {
        $account->loadMissing(['departments', 'jobTitle', 'role']);

        return [
            'id' => (int) $account->id,
            'name' => (string) $account->name,
            'email' => (string) $account->email,
            'departments' => $account->departments
                ->map(fn (Department $department): array => [
                    'id' => (int) $department->id,
                    'name' => (string) $department->name,
                ])
                ->values()
                ->all(),
            'job_title' => $account->jobTitle
                ? ['id' => (int) $account->jobTitle->id, 'name' => (string) $account->jobTitle->name]
                : null,
            'role' => $account->role
                ? ['id' => (int) $account->role->id, 'name' => (string) $account->role->name]
                : null,
            'is_active' => (bool) $account->is_active,
        ];
    }
}
