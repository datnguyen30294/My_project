<?php

declare(strict_types=1);

namespace App\Modules\PMC\Project\ExternalServices\Platform;

/**
 * Bridge để Platform tra tên dự án theo `(tenant_id, project_id)` từ registry
 * trung tâm `platform_projects` mà không import trực tiếp model của PMC.
 *
 * Đơn vendor resi_mart chỉ lưu `tenant_id` + `project_id` (không lưu tên), nên
 * báo cáo cross-tenant cần map này để hiển thị tên dự án thật thay cho nhãn dự
 * phòng "Dự án #<id>".
 */
interface PlatformProjectDirectoryExternalServiceInterface
{
    /**
     * Map "<tenant_id>|<project_id>" => tên dự án, gộp toàn bộ tenant (đọc một
     * lần từ connection trung tâm, không cần $tenant->run).
     *
     * @return array<string, string>
     */
    public function getProjectNameMap(): array;
}
