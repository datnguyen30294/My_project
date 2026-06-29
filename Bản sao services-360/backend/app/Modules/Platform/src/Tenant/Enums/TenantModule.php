<?php

namespace App\Modules\Platform\Tenant\Enums;

enum TenantModule: string
{
    case Hrm = 'hrm';
    case TicketManagement = 'quan-ly-ticket';
    case WorkManagement = 'quan-ly-cong-viec';
    case OrderManagement = 'quan-ly-don-hang';
    case WarehouseAndService = 'kho-va-dich-vu';
    case AccountingFinance = 'ke-toan-tai-chinh';
    case Report = 'bao-cao';
    case Setting = 'cai-dat';

    public function label(): string
    {
        return match ($this) {
            self::Hrm => 'HRM',
            self::TicketManagement => 'Quản lý ticket',
            self::WorkManagement => 'Quản lý công việc',
            self::OrderManagement => 'Quản lý đơn hàng',
            self::WarehouseAndService => 'Kho và dịch vụ',
            self::AccountingFinance => 'Kế toán tài chính',
            self::Report => 'Báo cáo',
            self::Setting => 'Cài đặt',
        };
    }

    /** @return array<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
