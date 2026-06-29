<?php

namespace App\Modules\Platform\Report\Support;

/**
 * Normalized platform-wide marketplace order row (fact-set).
 * Built once per request by ReportAggregationService::collectPlatformVendorOrders().
 * `residentRating`/`residentRatingComment` carry the resident's published review
 * (resi_mart `order_reviews`), null when the order has no published review or the
 * vendor schema predates the reviews table. `customerSource` stays null until that
 * column lands in resi_mart.
 */
final readonly class PlatformVendorOrderRow
{
    public function __construct(
        public int $orderId,
        public int $partnerId,
        public string $partnerName,
        public ?int $projectId,
        public ?string $projectName,
        public ?string $organizationId,     // PMC operator slug (company)
        public ?int $residentId,
        public ?string $residentName,
        public ?string $customerSource,     // 'project' | 'walk_in' | null (pre-wiring)
        public string $type,                // 'product' | 'service'
        public ?string $offerTitle,
        public int $amount,                 // GMV, integer VND
        public int $commissionAmount,       // integer VND
        public string $recipient,           // RevenueRecipient value
        public int $platformShare,          // commissionAmount if recipient=platform else 0
        public int $vhShare,                // commissionAmount if recipient=operating_company else 0
        public string $status,              // VendorOrderStatus value
        public ?int $residentRating,        // 1-5 or null
        public ?string $residentRatingComment,
        public string $createdAt,           // ISO date
        public ?string $partnerStatus = null,       // PartnerStatus value
        public ?string $partnerStatusLabel = null,  // PartnerStatus label (VI)
    ) {}

    /**
     * Bản sao bất biến với `projectName` thay thế — dùng khi enrich tên dự án
     * thật từ registry trung tâm (đơn vendor resi_mart chỉ mang `projectId`).
     */
    public function withProjectName(?string $projectName): self
    {
        return new self(
            orderId: $this->orderId,
            partnerId: $this->partnerId,
            partnerName: $this->partnerName,
            projectId: $this->projectId,
            projectName: $projectName,
            organizationId: $this->organizationId,
            residentId: $this->residentId,
            residentName: $this->residentName,
            customerSource: $this->customerSource,
            type: $this->type,
            offerTitle: $this->offerTitle,
            amount: $this->amount,
            commissionAmount: $this->commissionAmount,
            recipient: $this->recipient,
            platformShare: $this->platformShare,
            vhShare: $this->vhShare,
            status: $this->status,
            residentRating: $this->residentRating,
            residentRatingComment: $this->residentRatingComment,
            createdAt: $this->createdAt,
            partnerStatus: $this->partnerStatus,
            partnerStatusLabel: $this->partnerStatusLabel,
        );
    }

    public function isActive(): bool
    {
        return $this->status !== 'cancelled';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
