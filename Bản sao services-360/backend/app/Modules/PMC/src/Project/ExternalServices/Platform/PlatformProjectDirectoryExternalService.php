<?php

declare(strict_types=1);

namespace App\Modules\PMC\Project\ExternalServices\Platform;

use App\Modules\PMC\Project\Repositories\PlatformProjectRegistryRepository;

class PlatformProjectDirectoryExternalService implements PlatformProjectDirectoryExternalServiceInterface
{
    public function __construct(
        protected PlatformProjectRegistryRepository $registryRepository,
    ) {}

    public function getProjectNameMap(): array
    {
        return $this->registryRepository->getNameMap();
    }
}
