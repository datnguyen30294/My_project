<?php

declare(strict_types=1);

namespace App\Modules\Platform\OgOrder\Contracts;

interface OgOrderConsoleServiceInterface
{
    /**
     * List ĐỌC-CHỈ gộp mọi đơn OG cross-tenant, phân trang trong bộ nhớ.
     *
     * @param  array<string, mixed>  $filters
     * @return array{
     *     data: \Illuminate\Pagination\LengthAwarePaginator,
     *     rows: list<array<string, mixed>>,
     *     warnings: array{tenants_failed: int},
     * }
     */
    public function listAll(array $filters): array;

    /**
     * 4 thẻ tổng hợp (đơn / GMV / phí nền tảng / số công ty VH) cho cùng bộ lọc.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getSummary(array $filters): array;
}
