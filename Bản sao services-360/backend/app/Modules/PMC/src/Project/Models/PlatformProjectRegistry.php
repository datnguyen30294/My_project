<?php

declare(strict_types=1);

namespace App\Modules\PMC\Project\Models;

use App\Modules\PMC\Project\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Central read-model mirroring every tenant project, used for cross-tenant
 * `code` uniqueness + `code => (tenant_id, project_id)` resolution.
 *
 * Source of truth is `tenant_<x>.projects`; this row is kept in sync by
 * {@see \App\Modules\PMC\Project\Services\ProjectRegistrar}. The registrar
 * WRITES via the tenant connection (schema-qualified, for atomicity with the
 * project insert); this model is for READS / backfill on the central connection.
 *
 * Not a BaseModel: this is a system-managed mirror with no per-user auditing.
 *
 * @property string $code
 * @property string $tenant_id
 * @property int $project_id
 * @property string $name
 * @property ProjectStatus $status
 */
class PlatformProjectRegistry extends Model
{
    use SoftDeletes;

    protected $table = 'platform_projects';

    /** @var list<string> */
    protected $fillable = [
        'code',
        'tenant_id',
        'project_id',
        'name',
        'status',
    ];

    public function getConnectionName(): ?string
    {
        return config('tenancy.database.central_connection');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'project_id' => 'integer',
            'status' => ProjectStatus::class,
        ];
    }
}
