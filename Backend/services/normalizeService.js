/**
 * Normalize raw parsed mandi data into a consistent structure
 * Output format:
 * {
 *   date: Date,
 *   commodity: string,
 *   price: number,
 *   market: string
 * }
 */

export const normalizeData = (data) => {
  if (!Array.isArray(data)) return [];

  const normalized = data
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      // 🔍 Flexible key detection (handles messy inputs)
      const dateRaw =
        item.date || item.Date || item.DATE || item.day || null;

      const priceRaw =
        item.price ||
        item.Price ||
        item.PRICE ||
        item.rate ||
        item.Rate ||
        item.cost ||
        null;

      const commodityRaw =
        item.commodity ||
        item.Commodity ||
        item.crop ||
        item.Crop ||
        null;

      const marketRaw =
        item.market ||
        item.Market ||
        item.mandi ||
        item.Mandi ||
        item.location ||
        null;

      // ❌ Skip if critical data missing
      if (!priceRaw) return null;

      // 🔢 Convert price safely
      let price = Number(priceRaw);
      if (isNaN(price)) return null;

      // 📅 Convert date safely
      let date = null;
      if (dateRaw) {
        const parsedDate = new Date(dateRaw);
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate;
        }
      }

      return {
        date: date || null,
        price,
        commodity: commodityRaw
          ? String(commodityRaw).toLowerCase().trim()
          : "unknown",
        market: marketRaw
          ? String(marketRaw).toLowerCase().trim()
          : "unknown",
      };
    })
    .filter(Boolean); // remove nulls

  return normalized;
};