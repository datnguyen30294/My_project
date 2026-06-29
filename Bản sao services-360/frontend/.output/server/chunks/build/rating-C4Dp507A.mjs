function residentRatingAvgLabel(avgRating, ratedCount) {
  if (avgRating === null || avgRating === void 0) {
    return "—";
  }
  const count = ratedCount ?? 0;
  return `${avgRating.toFixed(1)} (${count})`;
}

export { residentRatingAvgLabel as r };
//# sourceMappingURL=rating-C4Dp507A.mjs.map
