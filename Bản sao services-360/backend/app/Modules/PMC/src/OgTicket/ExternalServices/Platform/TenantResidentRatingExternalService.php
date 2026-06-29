<?php

declare(strict_types=1);

namespace App\Modules\PMC\OgTicket\ExternalServices\Platform;

use App\Modules\Platform\Tenant\Models\Organization;
use App\Modules\Platform\Ticket\Models\Ticket;
use App\Modules\PMC\OgTicket\Models\OgTicket;

class TenantResidentRatingExternalService implements TenantResidentRatingExternalServiceInterface
{
    public function getRatingsForTenant(Organization $tenant, array $filters): array
    {
        return $tenant->run(function () use ($filters): array {
            $base = OgTicket::query()->whereNotNull('resident_rating');

            // Scope to a single project when requested — summary is computed on
            // the project-filtered set (but never on the `rating` filter).
            if (! empty($filters['project_id'])) {
                $base->where('project_id', (int) $filters['project_id']);
            }

            $average = (clone $base)->avg('resident_rating');

            $summary = [
                'average' => $average !== null ? round((float) $average, 1) : null,
                'count' => (clone $base)->count(),
            ];

            $query = (clone $base)->with(['customer:id,full_name', 'project:id,name']);

            if (! empty($filters['rating'])) {
                $query->where('resident_rating', (int) $filters['rating']);
            }

            $paginator = $query
                ->orderByDesc('resident_rated_at')
                ->orderByDesc('id')
                ->paginate((int) ($filters['per_page'] ?? 20));

            $ticketCodes = Ticket::query()
                ->whereIn('id', $paginator->getCollection()->pluck('ticket_id')->all())
                ->pluck('code', 'id');

            $paginator->through(fn (OgTicket $ogTicket): array => [
                'ticket_id' => (int) $ogTicket->ticket_id,
                'ticket_code' => $ticketCodes[$ogTicket->ticket_id] ?? null,
                'subject' => (string) $ogTicket->subject,
                'project_name' => $ogTicket->project?->name,
                'resident_name' => $ogTicket->customer?->full_name ?? $ogTicket->requester_name,
                'rating' => (int) $ogTicket->resident_rating,
                'comment' => $ogTicket->resident_rating_comment,
                'rated_at' => $ogTicket->resident_rated_at?->toIso8601String(),
            ]);

            return ['summary' => $summary, 'paginator' => $paginator];
        });
    }
}
