<?php

namespace Tests\Feature\PMC;

use App\Modules\PMC\OgTicket\Models\OgTicket;
use App\Modules\PMC\Quote\Enums\QuoteStatus;
use App\Modules\PMC\Quote\Models\Quote;
use App\Modules\PMC\Quote\Repositories\QuoteRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Resident-facing quote selection (public /tickets/{code} page) must be
 * deterministic. Trong luồng báo giá lại có thể tồn tại 2 quote active cùng
 * lúc (effective Approved + draft replacement) — cư dân chỉ được thấy quote
 * ở trạng thái ManagerApproved/Approved/ResidentRejected, ưu tiên quote mới
 * nhất. Draft/Sent không bao giờ được trả về cho cư dân.
 */
class QuoteResidentVisibleSelectionTest extends TestCase
{
    use RefreshDatabase;

    private QuoteRepository $quoteRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->quoteRepository = app(QuoteRepository::class);
    }

    #[Test]
    public function test_returns_manager_approved_quote(): void
    {
        $ogTicket = OgTicket::factory()->create();
        $quote = Quote::factory()->managerApproved()->create(['og_ticket_id' => $ogTicket->id]);

        $found = $this->quoteRepository->findResidentVisibleByOgTicket($ogTicket->id);

        $this->assertNotNull($found);
        $this->assertSame($quote->id, $found->id);
    }

    #[Test]
    public function test_ignores_draft_and_sent_quotes(): void
    {
        $ogTicket = OgTicket::factory()->create();
        Quote::factory()->create(['og_ticket_id' => $ogTicket->id]);
        Quote::factory()->sent()->create(['og_ticket_id' => $ogTicket->id]);

        $found = $this->quoteRepository->findResidentVisibleByOgTicket($ogTicket->id);

        $this->assertNull($found, 'Draft/Sent quotes must never be visible to residents.');
    }

    #[Test]
    public function test_ignores_inactive_quotes(): void
    {
        $ogTicket = OgTicket::factory()->create();
        Quote::factory()->approved()->inactive()->create(['og_ticket_id' => $ogTicket->id]);

        $found = $this->quoteRepository->findResidentVisibleByOgTicket($ogTicket->id);

        $this->assertNull($found);
    }

    /**
     * Luồng báo giá lại trước khi QL duyệt: quote cũ Approved vẫn effective,
     * quote mới Draft cùng active. Cư dân phải tiếp tục thấy quote Approved
     * (không phụ thuộc thứ tự insert / hành vi `.first()` không ORDER BY).
     */
    #[Test]
    public function test_requote_window_returns_effective_quote_not_draft(): void
    {
        $ogTicket = OgTicket::factory()->create();
        $approved = Quote::factory()->approved()->create(['og_ticket_id' => $ogTicket->id]);
        Quote::factory()->create(['og_ticket_id' => $ogTicket->id]);

        $found = $this->quoteRepository->findResidentVisibleByOgTicket($ogTicket->id);

        $this->assertNotNull($found);
        $this->assertSame($approved->id, $found->id);
        $this->assertSame(QuoteStatus::Approved, $found->status);
    }

    /**
     * Sau khi QL duyệt báo giá lần 2: quote cũ bị deactivate, quote mới
     * ManagerApproved là quote duy nhất cư dân thấy → actionable.
     */
    #[Test]
    public function test_after_manager_approval_returns_new_manager_approved_quote(): void
    {
        $ogTicket = OgTicket::factory()->create();
        Quote::factory()->approved()->inactive()->create(['og_ticket_id' => $ogTicket->id]);
        $replacement = Quote::factory()->managerApproved()->create(['og_ticket_id' => $ogTicket->id]);

        $found = $this->quoteRepository->findResidentVisibleByOgTicket($ogTicket->id);

        $this->assertNotNull($found);
        $this->assertSame($replacement->id, $found->id);
        $this->assertSame(QuoteStatus::ManagerApproved, $found->status);
    }

    #[Test]
    public function test_resident_rejected_quote_is_visible(): void
    {
        $ogTicket = OgTicket::factory()->create();
        $rejected = Quote::factory()->residentRejected()->create(['og_ticket_id' => $ogTicket->id]);

        $found = $this->quoteRepository->findResidentVisibleByOgTicket($ogTicket->id);

        $this->assertNotNull($found);
        $this->assertSame($rejected->id, $found->id);
    }
}
