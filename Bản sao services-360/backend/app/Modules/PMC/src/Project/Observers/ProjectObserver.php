<?php

declare(strict_types=1);

namespace App\Modules\PMC\Project\Observers;

use App\Modules\PMC\Project\Models\Project;
use App\Modules\PMC\Project\Services\ProjectRegistrar;

/**
 * Funnels every project write into the central registry. Because all create /
 * update / delete paths (repository, service, seeder, factory) go through the
 * Eloquent model, observing it is the single chokepoint that cannot be bypassed.
 */
class ProjectObserver
{
    public function __construct(private ProjectRegistrar $registrar) {}

    public function created(Project $project): void
    {
        $this->registrar->sync($project);
    }

    public function updated(Project $project): void
    {
        $this->registrar->sync($project);
    }

    public function deleted(Project $project): void
    {
        // forceDelete fires `deleted` then `forceDeleted`; let the latter handle it.
        if ($project->isForceDeleting()) {
            return;
        }

        $this->registrar->softDelete($project);
    }

    public function restored(Project $project): void
    {
        $this->registrar->sync($project);
    }

    public function forceDeleted(Project $project): void
    {
        $this->registrar->forceDelete($project);
    }
}
