/**
 * Hiển thị điểm CSAT trung bình kèm số lượt đánh giá cho bảng/thẻ báo cáo.
 *
 * BE trả `avg_rating = null` khi chưa có lượt đánh giá nào (hoặc chưa wiring
 * đánh giá cư dân) → hiển thị "—" thay vì "0.0". Khi có dữ liệu hiển thị
 * "4.6 (12)" — điểm 1 chữ số thập phân kèm số lượt trong ngoặc.
 */
export function residentRatingAvgLabel(
  avgRating: number | null | undefined,
  ratedCount: number | null | undefined
): string {
  if (avgRating === null || avgRating === undefined) {
    return '—'
  }

  const count = ratedCount ?? 0
  return `${avgRating.toFixed(1)} (${count})`
}
