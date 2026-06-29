<?php

declare(strict_types=1);

namespace App\Modules\PMC\Project\Repositories;

use App\Common\Repositories\BaseRepository;
use App\Modules\PMC\Project\Models\PlatformProjectRegistry;

class PlatformProjectRegistryRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new PlatformProjectRegistry);
    }

    /**
     * Map "<tenant_id>|<project_id>" => tên dự án, gộp mọi tenant từ registry
     * trung tâm. Hàng soft-delete bị loại bởi global scope của SoftDeletes.
     *
     * @return array<string, string>
     */
    public function getNameMap(): array
    {
        return $this->newQuery()
            ->get(['tenant_id', 'project_id', 'name'])
            ->mapWithKeys(fn (PlatformProjectRegistry $row): array => [
                $row->tenant_id.'|'.$row->project_id => (string) $row->name,
            ])
            ->all();
    }
}
